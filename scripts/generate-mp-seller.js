const ACCESS_TOKEN = "PON_AQUI_TU_TOKEN_ACTUAL";

async function createTestSeller() {
    try {
        const response = await fetch('https://api.mercadopago.com/users/test_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                site_id: "MLC",
                description: "seller"
            })
        });

        const data = await response.json();
        console.log("Respuesta de Mercado Pago:");
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error al crear usuario de prueba:", error);
    }
}

createTestSeller();
