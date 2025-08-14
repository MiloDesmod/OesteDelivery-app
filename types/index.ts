// types/index.ts

// Define la estructura de un solo producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

// Define la estructura de un Local, que puede tener una lista de productos
export interface Local {
  id: number;
  nombre: string;
  direccion: string;
  logo: string | null;
  productos: Producto[];
}

// Define la estructura de un item dentro de nuestro carrito
export interface CartItem extends Producto {
    quantity: number;
}

export interface Orden {
  id: number;
  local: { // Objeto anidado
    nombre: string;
  };
  estado: string;
  total: string; // El backend lo devuelve como string, lo podemos convertir si es necesario
  fecha_creacion: string;
}