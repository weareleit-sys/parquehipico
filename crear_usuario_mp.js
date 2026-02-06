/**
 * Script para crear usuario de prueba en MercadoPago
 */

// HE PUESTO TU TOKEN AQUÍ DIRECTAMENTE:
const TOKEN_ACTUAL = 'APP_USR-7069132968758424-011408-9924e6599cc23ec0d29c6c3d14f4b3f3-3134094374';

async function crearUsuarioPrueba() {
    console.log('🔄 Creando usuario "Vendedor de Prueba"...');

    try {
        const response = await fetch('https://api.mercadopago.com/users/test_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN_ACTUAL}`
            },
            body: JSON.stringify({
                site_id: 'MLC', // Chile
                description: 'seller'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('\n==========================================');
            console.log('✅ ¡ÉXITO! COPIA ESTE TOKEN NUEVO:');
            console.log('==========================================');
            console.log(data.access_token); // Este es el que necesitamos
            console.log('==========================================\n');
        } else {
            console.error('❌ Error:', data);
        }

    } catch (error) {
        console.error('Error de conexión:', error.message);
    }
}

crearUsuarioPrueba();
