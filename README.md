# **2020-10**
Sistema de Administracion de la Piscina del Departamento de Promocion Estudiantil

## Clonar repositorio

Pasos:
1. Descargar e instalar [GitHub Desktop](https://desktop.github.com/) 
2. Abrir la aplicacion e Iniciar sesion.
3. Selecionar la opcion de ***Clonar un repositorio de Internet...*** o ***Clone a repository from Internet...***
4. Selecionan el repositorio (user-name)/2020-10, seguido por el Path o Direccion en su computadora
donde van a dejar la carpeta de su proyecto.

**OJO**, solo tiene que hacer eso una vez.
**No** pueden mover absolutamente nada fuera de esta carpeta en su pc.
**No** pueden hacer copias externas en otro path de la computadora y trabajar sobre la copia. Solamente dentro del path del repo.

## Utilizar la consola de Git Bash 

Seguir los pasos 1-4 anteriores con GitHub Desktop.
1. Descargan e instalan [Git Bash](https://git-scm.com/downloads)
2. En la carpeta de su proyecto, click derecho y eligen la opcion, ***Git Bash Here***

Se les abrira una Consola, les debera aparecer el path del proyecto seguido por el branch **(master)** esto significaria
que esta bien posicionado y que los archivos git funcionan.

## Comandos de git:
```
git status
```
git status muestra los archivos que han sido modificados, aniadidos o eliminados.
```
git log
```
git log muestra el log de commits que se han hecho en el repositorio.
```
git branch
```
git branch muestra una lista de los branches que existen en el repositorio.
```
git checkout nombre-del-branch
```
sirve para moverse entre branches, en este caso vamos al branch que indicamos en el comando. (Esto solo si estamos en sprint)
```
git add -a
```
sirve para aniadir _todos_ los archivos _nuevos_.
```
git commit -a -m "_nombre del commit_"
```
aniade todos los archivos a un commit para luego hacer commit. ```-a``` referencia a todo(all).
```-m "nombre"``` referencia a mensaje o nombre del commit, entre comillas dobles el nombre. ***importante poner el nombre***
```
git push
```
sube(_push_) los cambios en el repositorio **en el branch en el que se encuentra posicionado**.
```
git push origin nombre-del-branch
```
sube(_push_) los cambios en el repositorio **en el branch en el que se indique en nombre-del-branch**.

## Pasos para ejecutar comandos en git al hacer cambios en el programa

Si se hace un cambio en **al menos un archivo** git reconoce los cambios hechos en los archivos. Se recomienda siempre trabajar
una parte sin tiempo definido, pero corto, hasta que funcione, se hacen las pruebas. Una vez funcionando el programa se deben ejecutar los siguientes comandos.

1. ```git status``` para verificar que hayan cambios en el repositorio local.
2. Si se aniadieron archivos nuevos a la carpeta apareceran en rojo, luego se ejecuta el comando ```git add -a``` para aniadir los archivos al commit. 
3. Seguido por ```git commit -a -m "nombreDelCommit"``` en ```"nombreDelCommit"``` se pone el cambio que se realizo en el programa.
4. Una vez hecho el commit se ejecuta ```git push``` para subir el commit al repositorio en el branch en el que se encuentra. Para saber en cual branch se encuentra en la consola antes de escribir cualquier comando debe aparecer en color _cyan_ el nombre del branch. ***Se debe siempre antes verificar el branch en el que se encuentra antes de hacer git push.***



## Authors

 **Ian Mora Rodriguez** - *Initial work* - [@ianmora97](https://github.com/ianmora97)

See also the list of [contributors](https://github.com/ianmora97/2020-10/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

