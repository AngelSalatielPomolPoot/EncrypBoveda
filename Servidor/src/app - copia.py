from flask import Flask, jsonify, request

from cryptography.fernet import Fernet
import pymysql as pm
import numpy as np
import pandas as pd


app = Flask(__name__)


from products import products

#llave de encriptacion--------------------
def generate_key():
    """
    Generates a key and save it into a file
    """
    key = Fernet.generate_key()
    if(open("secret.key", "rb").read()==""):
        print("entro----------------")
        with open("secret.key", "wb") as key_file:
            key_file.write(key)
    else:
        print("no entro-----------------")

def load_key():
    """
    Loads the key named `secret.key` from the current directory.
    """
    return open("secret.key", "rb").read()

#conexion de base de datos --------------
try:
    db=pm.connect(host="localhost", user="root", passwd="", db="boveda_encriptacion")
    
    generate_key();
except:
    print("no existe BD")
    exit()

#---------------------------------------------------------
#               Creacion de la API
#---------------------------------------------------------

# Testing Route 
@app.route('/', methods=['GET'])
def index():
    return jsonify({'response': 'hola!'})

# Get Data Routes
@app.route('/cuentas')
def getCuentas():
    # return jsonify(products)
    try:
        df=pd.read_sql('SELECT * FROM cuentas', db)
        cuentas = df.to_numpy()
        listaCuentas=[]
        for cuenta in cuentas:
            #Desencriptar-------------------------
            key = load_key()
            f = Fernet(key) #desencriptar contraseña
            decrypted_usuario = f.decrypt(cuenta[3].encode()).decode()
            decrypted_contrasenia = f.decrypt(cuenta[4].encode()).decode()
            cuentaDiccionario={"id":cuenta[0],"sitioWeb":cuenta[1],"urlSitioWeb":cuenta[2],"usuario":decrypted_usuario,"contrasenia":decrypted_contrasenia}
            listaCuentas.append(cuentaDiccionario)

        return jsonify({'cuentas': listaCuentas})
    except:
        return jsonify({'Error': "erro de conexion BD"})


@app.route('/cuentas/<int:id_cuenta>')
def getCuenta(id_cuenta):
    try:
        df=pd.read_sql('SELECT * FROM cuentas', db)
        df1=df[df['id'] == id_cuenta]
        cuentas = df1.to_numpy()
        
        if (len(cuentas) > 0):
            #Desencriptar-------------------------
            key = load_key()
            f = Fernet(key) #desencriptar contraseña
            decrypted_usuario = f.decrypt(cuentas[0][3].encode()).decode()
            decrypted_contrasenia = f.decrypt(cuentas[0][4].encode()).decode()
            cuentaEncontrada={"id":cuentas[0][0],"sitioWeb":cuentas[0][1],"urlSitioWeb":cuentas[0][2],"usuario":decrypted_usuario,"contrasenia":decrypted_contrasenia}
            return jsonify({'cuentas': cuentaEncontrada})
        return jsonify({'message': 'Cuenta no encontrada'})
    except:
        return jsonify({'Error': "erro de conexion BD"})

# Create Data Routes
@app.route('/cuentas_add', methods=['POST'])
def addCuentas():
    sitioWeb= request.json['sitioWeb']
    urlSitioWeb= request.json['urlSitioWeb']
    usuario= request.json['usuario']
    contrasenia= request.json['contrasenia']
    try:
    #Proceso Encriptación ---------------------
        key = load_key()
        f = Fernet(key)
        encrypted_contrasenia = f.encrypt(contrasenia.encode())
        encrypted_usuario = f.encrypt(usuario.encode())
        cursor=db.cursor()

        cursor.execute("insert into cuentas (sitioWeb, urlSitioWeb, usuario, contrasenia) values(%s,%s,%s,%s)", (sitioWeb, urlSitioWeb, encrypted_usuario, encrypted_contrasenia))
        db.commit()

        return jsonify({'Mensaje': "Guardado exitoso"})
    except:
        return jsonify({'Error': "Error al momento de guardar"})


if __name__ == '__main__':
    app.run(debug=True, port=4000)
