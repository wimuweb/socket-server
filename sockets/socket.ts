import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarios-lista';
import { Usuario } from "../classes/usuario";




export const usuariosConectados = new UsuarioLista();

export const conectarCliente = (cliente: Socket, io: SocketIO.Server) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
  
}


export const desconectar = (cliente: Socket, io: SocketIO.Server) => {

    cliente.on('disconnect', () => {
        const usuario = cliente.id
        usuariosConectados.borrarUsuario(usuario);
        console.log('Cliente Desconectado');
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });
}

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recivido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}

// Configurar ususario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: Function) => {


        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

        io.emit('usuarios-activos', usuariosConectados.getLista());

        // console.log('Configurando Usuario', payload.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
        // io.emit('mensaje-nuevo',payload);

    });
}

//  Obetener Usuarios
export const ObtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuario', () => {




        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());

        // console.log('Configurando Usuario', payload.nombre);
       

    });
}
