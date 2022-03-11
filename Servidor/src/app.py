from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from cryptography.fernet import Fernet
import pymysql as pm
import numpy as np
import pandas as pd


app = Flask(__name__)
#---------------------------------------------------------
#               Conexion base de datos
#---------------------------------------------------------

#configura
app.config['MYSQL_HOST']='localhost'
app.config['MYSQL_USER']='root'
app.config['MYSQL_PASSWORD']=''
app.config['MYSQL_DB']='boveda_encriptacion'

mysql=MySQL(app)

from products import products

#---------------Funciones--------------
def getData(sQuery):
    #crear cursor de ejecucion
    cur=mysql.connection.cursor()

    #ejecutar la sentencia
    cur.execute(sQuery)

    #obtiene los datos
    data=cur.fetchall()
    return data

def executeSQL(sQuery):
     #crear cursor de ejecucion
    cur=mysql.connection.cursor()

     #ejecutar la sentencia
    cur.execute(sQuery)

    #commit
    mysql.connection.commit()

    #retornar los datos
    return cur.rowcount

#---------------------------------------------------------
#               llave de encriptacion
#---------------------------------------------------------

def generate_key():
    #Genera una lleve dentro de un archivo    
    key = Fernet.generate_key()
    if(open("secret.key", "rb").read()==""):
        print("entro----------------")
        with open("secret.key", "wb") as key_file:
            key_file.write(key)
    else:
        print("no entro-----------------")

def load_key():
    
    #Loads the key named `secret.key` from the current directory.
    return open("secret.key", "rb").read()




#---------------------------------------------------------
#               Creacion de la API
#---------------------------------------------------------

# Testing Route 
@app.route('/api', methods=['GET'])
def index():
    return jsonify({'response': 'coriendo!'})

#----------------- Datos cuenta ----------------------
@app.route('/api/cuentas')
def getCuentas():
    id_usuario=request.args.get("id_usuario")
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            cuentas=getData('SELECT * FROM cuentas WHERE idUsuario='+str(id_usuario))
            listaCuentas=[]
            for cuenta in cuentas:
                #Desencriptar-------------------------
                key = load_key()
                f = Fernet(key) #desencriptar contraseña
                decrypted_usuario = f.decrypt(cuenta[4].encode()).decode()
                decrypted_contrasenia = f.decrypt(cuenta[5].encode()).decode()
                cuentaDiccionario={"id":cuenta[0],"idUsuario":cuenta[1],"sitioWeb":cuenta[2],"urlSitioWeb":cuenta[3],"usuario":decrypted_usuario,"contrasenia":decrypted_contrasenia}
                listaCuentas.append(cuentaDiccionario)

            return jsonify({'cuentas': listaCuentas})
        except:
            return jsonify({'cuentas':'{[]}','Mensaje': "se ha producido un error inesperado"})
    else:
        return jsonify({'cuentas':'{[]}','Mensaje': "No se pudo acceder a los datos"})    

@app.route('/api/cuentas/busqueda')
def getCuenta():
    accederHeader=request.headers.get('acceder')
    id_cuenta=request.args.get("id_cuenta")
    id_usuario=request.args.get("id_usuario")
    
    if(accederHeader=="True"):
        try:
            sQuery="SELECT * FROM cuentas WHERE id="+str(id_cuenta)+" AND idUsuario="+str(id_usuario)
            cuenta=getData(sQuery)
            listaCuentas=[]
            if (len(cuenta) > 0):
                #Desencriptar-------------------------
                key = load_key()
                f = Fernet(key) #desencriptar contraseña
                decrypted_usuario = f.decrypt(cuenta[0][4].encode()).decode() 
                decrypted_contrasenia = f.decrypt(cuenta[0][5].encode()).decode()
                cuentaEncontrada={"id":cuenta[0][0],"idUsuario":cuenta[0][1],"sitioWeb":cuenta[0][2],"urlSitioWeb":cuenta[0][3],"usuario":decrypted_usuario,"contrasenia":decrypted_contrasenia}
                listaCuentas.append(cuentaEncontrada)
                return jsonify({'cuentas': listaCuentas})
            return jsonify({'cuentas':'{[]}','Mensaje': 'Cuenta no encontrada'})
        except:
            return jsonify({'cuentas':'{[]}','Mensaje': "se ha producido un error inesperado"})
    else:
        return jsonify({'cuentas':'{[]}','Mensaje': "No se pudo acceder a los datos"})

# Create Data Routes
@app.route('/api/cuentas_add', methods=['POST'])
def addCuentas():
    sitioWeb= request.json['sitioWeb']
    urlSitioWeb= request.json['urlSitioWeb']
    usuario= request.json['usuario']
    contrasenia= request.json['contrasenia']
    idUsuario=request.json['idUsuario']
    try:
        #Proceso Encriptación ---------------------
        key = load_key()
        f = Fernet(key)
        encrypted_contrasenia = f.encrypt(contrasenia.encode()).decode()
        encrypted_usuario = f.encrypt(usuario.encode()).decode()
        sQuery="insert into cuentas (idUsuario, sitioWeb, urlSitioWeb, usuario, contrasenia) values(%s,'%s','%s','%s','%s')"%(idUsuario,sitioWeb, urlSitioWeb, encrypted_usuario, encrypted_contrasenia)
        cuentas=executeSQL(sQuery)
        return jsonify({'Mensaje': "Guardado"})
    except:
        return jsonify({'Mensaje': "Error al momento de guardar"})

@app.route('/api/cuentas_update', methods=['PUT'])
def actualizarCuenta():
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            id_cuenta= request.json['id']
            idUsuario=request.json['idUsuario']

            #datos actualizar
            sitioWeb= request.json['sitioWeb']
            urlSitioWeb= request.json['urlSitioWeb']
            usuario= request.json['usuario']
            contrasenia= request.json['contrasenia']

            #Proceso Encriptación ---------------------
            key = load_key()
            f = Fernet(key)
            encrypted_contrasenia = f.encrypt(contrasenia.encode()).decode()
            encrypted_usuario = f.encrypt(usuario.encode()).decode()

            sQuery="UPDATE cuentas SET sitioWeb='%s',urlSitioWeb='%s',usuario='%s',contrasenia='%s' WHERE id='%s' AND idUsuario=%s"%(sitioWeb,urlSitioWeb,encrypted_usuario,encrypted_contrasenia,id_cuenta,idUsuario)
            data=executeSQL(sQuery)
            print(data)
            if(data==1):
                    return jsonify({'Mensaje': "Dato actualizado exitosamente"})
            else:
                return jsonify({'Mensaje': "No se encontró dato para actualizar"})
            
        except:
            return jsonify({'Mensaje': "Error al momento de eliminar"})
    else:
        return jsonify({'Mensaje': "No se pudo acceder a los datos"})

@app.route('/api/cuentas_delete', methods=['DELETE'])
def eliminarCuenta():
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            id_cuenta= request.json['id']
            id_usuario= request.json['idUsuario']

            sQuery="DELETE FROM cuentas WHERE id='%s' AND idUsuario=%s"%(id_cuenta,id_usuario)
            data=executeSQL(sQuery)
            print(data)
            if(data==1):
                return jsonify({'Mensaje': "Dato eliminado exitosamente"})
            else:
                return jsonify({'Mensaje': "No se encontró dato para eliminar"})
            
        except:
            return jsonify({'Mensaje': "Error al momento de eliminar"})
    else:
        return jsonify({'Mensaje': "No se pudo acceder a los datos"})


#----------------- Datos tarjetas ----------------------
#obtener tarjetas ----------------------------------
@app.route('/api/tarjetas')
def getTarjetas():
    id_usuario=request.args.get("id_usuario")
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            tarjetas=getData('SELECT * FROM tarjetas WHERE idUsuario='+str(id_usuario))
            listaTarjetas=[]
            for tarjeta in tarjetas:
                #Desencriptar-------------------------
                key = load_key()
                f = Fernet(key) #desencriptar contraseña
                decrypted_numeroTarjeta = f.decrypt(tarjeta[4].encode()).decode()
                decrypted_expiracion = f.decrypt(tarjeta[5].encode()).decode()
                decrypted_cvv = f.decrypt(tarjeta[6].encode()).decode()
                decrypted_pin = f.decrypt(tarjeta[7].encode()).decode()
                tarjetaDiccionario={"id":tarjeta[0],"idUsuario":tarjeta[1],"nombreTitular":tarjeta[2],"nombreTarjeta":tarjeta[3],
                "numeroTarjeta":decrypted_numeroTarjeta,"expiracion":decrypted_expiracion,"cvv":decrypted_cvv,"pin":decrypted_pin,
                "Nota":tarjeta[8]}

                listaTarjetas.append(tarjetaDiccionario)

            return jsonify({'tarjetas': listaTarjetas})
        except:
            return jsonify({'tarjetas':'{[]}','Mensaje': "se ha producido un error inesperado"})
    else:
        return jsonify({'tarjetas':'{[]}','Mensaje': "No se pudo acceder a los datos"})    

#obtener tarjeta individual ---------------------------------
@app.route('/api/tarjetas/busqueda')
def getTarjeta():
    accederHeader=request.headers.get('acceder')
    id_tarjeta=request.args.get("id_tarjeta")
    id_usuario=request.args.get("id_usuario")
    
    if(accederHeader=="True"):
        try:
            sQuery="SELECT * FROM tarjetas WHERE id="+str(id_tarjeta)+" AND idUsuario="+str(id_usuario)
            tarjeta=getData(sQuery)
            listaTarjetas=[]
            
            if (len(tarjeta) > 0):
                #Desencriptar-------------------------
                key = load_key()
                f = Fernet(key) #desencriptar contraseña

                decrypted_numeroTarjeta = f.decrypt(tarjeta[0][4].encode()).decode()
                decrypted_expiracion = f.decrypt(tarjeta[0][5].encode()).decode()
                decrypted_cvv = f.decrypt(tarjeta[0][6].encode()).decode()
                decrypted_pin = f.decrypt(tarjeta[0][7].encode()).decode()

                
                tarjetaDiccionario=[{"id":tarjeta[0][0],"idUsuario":tarjeta[0][1],"nombreTitular":tarjeta[0][2],"nombreTarjeta":tarjeta[0][3],
                "numeroTarjeta":decrypted_numeroTarjeta,"expiracion":decrypted_expiracion,"cvv":decrypted_cvv,"pin":decrypted_pin,
                "nota":tarjeta[0][8]}]
                
                return jsonify({'tarjetas': tarjetaDiccionario})
            return jsonify({'tarjetas':'{[]}','Mensaje': 'Tarjeta no encontrada'})
        except:
            return jsonify({'tarjetas':'{[]}','Mensaje': "se ha producido un error inesperado"})
    else:
        return jsonify({'tarjetas':'{[]}','Mensaje': "No se pudo acceder a los datos"})

# Create Data Routes
@app.route('/api/tarjetas_add', methods=['POST'])
def addTarjetas():
    idUsuario=request.json['idUsuario']
    nombreTitular= request.json['nombreTitular']
    nombreTarjeta= request.json['nombreTarjeta']
    numeroTarjeta= request.json['numeroTarjeta']
    expiracion= request.json['expiracion']
    cvv= request.json['cvv']
    pin= request.json['pin']
    nota= request.json['nota']
   
    try:
        #Proceso Encriptación ---------------------
        key = load_key()
        f = Fernet(key)
        encrypted_numeroTitular = f.encrypt(numeroTarjeta.encode()).decode()
        encrypted_expiracion = f.encrypt(expiracion.encode()).decode()
        encrypted_cvv = f.encrypt(cvv.encode()).decode()
        encrypted_pin = f.encrypt(pin.encode()).decode()

        sQuery="INSERT INTO tarjetas (idUsuario, nombreTitular, nombreTarjeta, numeroTarjeta, expiracion, cvv, pin, nota) VALUES (%s,'%s','%s','%s','%s','%s','%s','%s')"%(idUsuario,nombreTitular,nombreTarjeta,encrypted_numeroTitular,encrypted_expiracion,encrypted_cvv,encrypted_pin,nota)
        cuentas=executeSQL(sQuery)
        return jsonify({'Mensaje': "Guardado"})
    except:
        return jsonify({'Mensaje': "Error al momento de guardar"})


@app.route('/api/tarjetas_update', methods=['PUT'])
def actualizarTarjetas():
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            id_tarjeta= request.json['id']
            idUsuario=request.json['idUsuario']
            
            #datos actualizar--------------------------
            nombreTitular= request.json['nombreTitular']
            nombreTarjeta= request.json['nombreTarjeta']
            numeroTarjeta= request.json['numeroTarjeta']
            expiracion= request.json['expiracion']
            cvv= request.json['cvv']
            pin= request.json['pin']
            nota= request.json['nota']
            
            #Proceso Encriptación ---------------------
            key = load_key()
            f = Fernet(key)

            
            encrypted_numeroTarjeta = f.encrypt(numeroTarjeta.encode()).decode()
            encrypted_expiracion = f.encrypt(expiracion.encode()).decode()
            encrypted_cvv = f.encrypt(cvv.encode()).decode()
            encrypted_pin = f.encrypt(pin.encode()).decode()

            sQuery="UPDATE tarjetas SET nombreTitular='%s',nombreTarjeta='%s',numeroTarjeta='%s',expiracion='%s',cvv='%s',pin='%s',nota='%s' WHERE id='%s' AND idUsuario=%s"%(nombreTitular,nombreTarjeta,encrypted_numeroTarjeta,encrypted_expiracion,encrypted_cvv,encrypted_pin,nota,id_tarjeta,idUsuario)
            data=executeSQL(sQuery)

            if(data==1):
                    return jsonify({'Mensaje': "Dato actualizado exitosamente"})
            else:
                return jsonify({'Mensaje': "No se encontró dato para actualizar"})
            
        except:
            return jsonify({'Mensaje': "Error al momento de actualizar"})
    else:
        return jsonify({'Mensaje': "No se pudo acceder a los datos"})


@app.route('/api/tarjeta_delete', methods=['DELETE'])
def eliminarTarjeta():
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            id_tarjeta= request.json['id']
            id_usuario= request.json['idUsuario']

            sQuery="DELETE FROM tarjetas WHERE id='%s' AND idUsuario=%s"%(id_tarjeta,id_usuario)
            data=executeSQL(sQuery)

            if(data==1):
                return jsonify({'Mensaje': "Dato eliminado exitosamente"})
            else:
                return jsonify({'Mensaje': "No se encontró dato para eliminar"})
            
        except:
            return jsonify({'Mensaje': "Error al momento de eliminar"})
    else:
        return jsonify({'Mensaje': "No se pudo acceder a los datos"})

#-------------------------------------------------------------------------
#añadir usuarios a la BD

# Create Data Routes
@app.route('/api/usuario_add', methods=['POST'])
def addUsuario():
    nombreUsuario= request.json['nombreUsuario']
    correo= request.json['correo']
    contrasenia= request.json['contrasenia']  
    try:
        sQuerySelect="SELECT * FROM usuarios WHERE correo='"+str(correo)+"'"
        usuarios=getData(sQuerySelect)
        if(len(usuarios)<1):
            key = load_key()
            f = Fernet(key)
           
            encrypted_contrasenia = f.encrypt(contrasenia.encode()).decode()
            sQuery="INSERT INTO usuarios (nombreUsuario, correo, contrasenia) VALUES('%s','%s','%s')"%(nombreUsuario,correo,encrypted_contrasenia)

            usuarioGuardado=executeSQL(sQuery)

            return jsonify({'Mensaje': "Guardado"})
        else:
            return jsonify({'Mensaje': "Usuario Existente"})
    except:
        return jsonify({'Mensaje': "Error al momento de guardar"})


@app.route('/api/usuario_login', methods=['POST'])
def loginUsuario():
    correo= request.json['correo']
    contrasenia= request.json['contrasenia']  
    try:
        sQuerySelect="SELECT * FROM usuarios WHERE correo='"+str(correo)+"'"
        usuarios=getData(sQuerySelect)
        if(len(usuarios)>0):
            key = load_key()
            f = Fernet(key)
            
            decrypted_contrasenia = f.decrypt(usuarios[0][3].encode()).decode();
            if(contrasenia==decrypted_contrasenia):
                return jsonify({'idUsuario':usuarios[0][0],'permiso': "permitido",'nombreUsuario':usuarios[0][1],'Mensaje': "Proceso Exitoso"})
            else:
                return jsonify({'permiso': "denegado",'nombreUsuario':'','Mensaje': "contrasenia incorrecta"})
        else:
            return jsonify({'permiso': "denegado",'nombreUsuario':'','Mensaje': "Usuario no encontrado"})
    except:
        return jsonify({'permiso': "denegado",'nombreUsuario':'','Mensaje': "Error Inesperado"})


#----------------- Datos archivos ----------------------
@app.route('/api/documentos')
def getDocumentos():
    id_usuario=request.args.get("id_usuario")
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            documentos=getData('SELECT * FROM documentos WHERE idUsuario='+str(id_usuario))
            listaDocumentos=[]
            for documento in documentos:
                #Desencriptar-------------------------
                key = load_key()
                f = Fernet(key) 
                decrypted_documento = f.decrypt(documento[3].encode()).decode();

                documentoDiccionario={"id":documento[0],"idUsuario":documento[1],"nombreDocumento":documento[2],"archivoData":decrypted_documento,"nota":documento[4]}
                listaDocumentos.append(documentoDiccionario)

            return jsonify({'documentos': listaDocumentos})
        except:
            return jsonify({'documentos':'{[]}','Mensaje': "se ha producido un error inesperado"})
    else:
        return jsonify({'docuemtos':'{[]}','Mensaje': "No se pudo acceder a los datos"})    

@app.route('/api/documentos/busqueda')
def getDocumento():
    accederHeader=request.headers.get('acceder')
    id_documento=request.args.get("id_documento")
    id_usuario=request.args.get("id_usuario")
    
    if(accederHeader=="True"):
        try:
            sQuery="SELECT * FROM documentos WHERE id="+str(id_documento)+" AND idUsuario="+str(id_usuario)
            
            documento=getData(sQuery)
            listaDocumentos=[]
            if (len(documento) > 0):
                #Desencriptar-------------------------
                key = load_key()
                f = Fernet(key) 
                decrypted_documento = f.decrypt(documento[0][3].encode()).decode();

                documentoEncontrada={"id":documento[0][0],"idUsuario":documento[0][1],"nombreDocumento":documento[0][2],"archivoData":decrypted_documento,"nota":documento[0][4]}
                print("llego")
                listaDocumentos.append(documentoEncontrada)
                return jsonify({'documentos': listaDocumentos})
            return jsonify({'documentos':'{[]}','Mensaje': 'Documentos no encontrada'})
        except:
            return jsonify({'documentos':'{[]}','Mensaje': "se ha producido un error inesperado"})
    else:
        return jsonify({'documentos':'{[]}','Mensaje': "No se pudo acceder a los datos"})

# Create Data Routes
@app.route('/api/documento_add', methods=['POST'])
def addDocumento():
    nombreDocumento= request.json['nombreDocumento']
    archivoData= request.json['archivoData']
    nota= request.json['nota']
    idUsuario=request.json['idUsuario']
    try:
        #Proceso Encriptación ---------------------
        key = load_key()
        f = Fernet(key)
            
        encrypted_documento = f.encrypt(archivoData.encode()).decode()
        sQuery="insert into documentos (idUsuario, nombreDocumento, archivoData, nota) values(%s,'%s','%s','%s')"%(idUsuario, nombreDocumento, encrypted_documento, nota)
        cuentas=executeSQL(sQuery)
        print(cuentas)
        return jsonify({'Mensaje': "Guardado"})
    except:
        return jsonify({'Mensaje': "Error al momento de guardar"})

@app.route('/api/documento_update', methods=['PUT'])
def actualizarDocumento():
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            id_documentos= request.json['id']
            idUsuario=request.json['idUsuario']

            #datos actualizar
            nombreDocumento= request.json['nombreDocumento']
            archivoData= request.json['archivoData']
            nota= request.json['nota']

            #Proceso Encriptación ---------------------
            key = load_key()
            f = Fernet(key)
            
            encrypted_documento = f.encrypt(archivoData.encode()).decode()

            sQuery="UPDATE documentos SET nombreDocumento='%s',archivoData='%s',nota='%s' WHERE id='%s' AND idUsuario=%s"%(nombreDocumento,encrypted_documento,nota,id_documentos,idUsuario)
            data=executeSQL(sQuery)
            print(data)
            if(data==1):
                    return jsonify({'Mensaje': "Dato actualizado exitosamente"})
            else:
                return jsonify({'Mensaje': "No se encontró dato para actualizar"})
            
        except:
            return jsonify({'Mensaje': "Error al momento de eliminar"})
    else:
        return jsonify({'Mensaje': "No se pudo acceder a los datos"})

@app.route('/api/documento_delete', methods=['DELETE'])
def eliminarDocumento():
    accederHeader=request.headers.get('acceder')
    if(accederHeader=="True"):
        try:
            id_documento= request.json['id']
            id_usuario= request.json['idUsuario']

            sQuery="DELETE FROM documentos WHERE id='%s' AND idUsuario=%s"%(id_documento,id_usuario)
            data=executeSQL(sQuery)
            print(data)
            if(data==1):
                return jsonify({'Mensaje': "Dato eliminado exitosamente"})
            else:
                return jsonify({'Mensaje': "No se encontró dato para eliminar"})
            
        except:
            return jsonify({'Mensaje': "Error al momento de eliminar"})
    else:
        return jsonify({'Mensaje': "No se pudo acceder a los datos"})



if __name__ == '__main__':
    generate_key();
    app.run(debug=True, port=4000)
