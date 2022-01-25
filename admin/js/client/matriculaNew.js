function loaded(event){
    fotoonChange();
}

function revisarImagen(){
    // fileFoto
    
    
}
function readURL(input) { 
    if (input.files && input.files[0]) {
        var reader = new FileReader(); 
        reader.onload = function (e) {
            $('#imagenSubida').css({
                'background':'url('+e.target.result+')',
                'background-size':'cover',
                'background-position': '50% 50%'
            });
        }; 
        reader.readAsDataURL(input.files[0]);
    }
}

function fotoonChange() {
    $("#fileFoto").change(function(event){
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = nombre.split('.')[archivos.length];
        console.log(tipo)

        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#buttonStatus').html(`
            <button type="submit" class="btn btn-primary d-block mx-auto mb-3" id="registrar">
                <div class="spinner-border spinner-border-sm" id="spinnerWaiter" role="status"
                    style="display: none;">
                    <span class="sr-only">Loading...</span>
                </div>
                <i class="fa fa-arrow-circle-up" aria-hidden="true"></i> Subir Comprobante
            </button>
            `)
        }else{
        }
                    
    });
}

document.addEventListener('DOMContentLoaded', loaded);