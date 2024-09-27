document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const formData = new FormData(form);
        const data = {
            nombre1: formData.get('Nombre 1'),
            nombre2: formData.get('Nombre 2'),
            apellido1: formData.get('Apellido 1'),
            apellido2: formData.get('Apellido 2'),
            correo: formData.get('Correo@gmail.com'),
            contraseña: formData.get('Contraseña')
        };

        fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error);
            } else {
                alert('Registro exitoso');
                window.location.href = 'inici.html'; // Redirige al inicio de sesión
            }
        })
        .catch(error => {
            console.error('Error en el registro:', error);
            alert('Hubo un problema en el registro. Inténtalo nuevamente.');
        });
    });
});
