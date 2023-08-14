import { Component, OnInit } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //Propiedad para guardad las url de descarga de las imágenes
  images: string[];

  constructor(private storage: Storage) {
    this.images = []; //Se inicializa la propiedad
   }

  //Método de arranque
  ngOnInit() {
    this.getImagies();
  }

  uploadImage($event: any) {

    const file = $event.target.files[0]; //Apuntamos al input y luego los ficheros, elejimos el primero
    console.log(file);

    //Creamos una referencia al sitio de firebase
    // En la referencia se coloca el servicio y el path, aún si el path no exíste se puede declarar
    const imgRef = ref(this.storage, `images/${file.name}`);

    //Insertamos la referencia y el fichero que queremos subir.
    //Nos retorna una promesa.
    //Método para subir la imágen.
    uploadBytes(imgRef, file)
    .then((response) => {
      console.log(response)
      //Nos podemos plantear guardar el path a la imágen en una de las propiedades del objeto que estemos insertando en la base de datos Firestore, para luego cuando llamemos a los datos el objeto guardado podamos usar ese mismo path y con una función de storage pintar la imágen en pantalla.
      //const fullPath = response.metadata.fullPath;
      //console.log(fullPath);
      //También se puede guardar la URL de descarga del un archivo directamente en el objeto que queremos guardar, aplicando el método getDownloadURL() con la referencia ref() del elemento en concreto.
      this.getImagies();
    } )
    .catch( (error) => { console.log(error) } )

  }

  //Método para obtener imágenes
  getImagies() {
    //Se crea una referencia
    //Con el método ref() le decimos qué queremos, archivo, imagen, carpeta, en sí la dirección
    const imagesRef = ref(this.storage, 'images');

    listAll(imagesRef)
    .then( async response => {

      console.log(response);

      this.images = []; //Borramos el array antes de el for para que no se vayan sobre escribiendo.

      for(let item of response.items) {
        //Podemos usar then y cach pero la anidación se puede tornar complicada de leer.
        const url = await getDownloadURL(item); // Obtenemos la URL de descarga de cada objeto del arreglo de items.
        this.images.push(url); //insertamos en el arreglo images cada una de las url traidas desde firebase.
      }
    })
    .catch( error => console.log(error) )
  }

}
