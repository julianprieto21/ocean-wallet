# Ocean Wallet

## Descripción

Aplicación web para gestionar las finanzas personales.

### Home

- Total de dinero disponible
- Porcetaje de dinero disponible en cada cuenta
- Ultimas transacciones realizadas
- Evolutivo de dinero disponible
- Montos en cuenta discriminado por moneda

### Transacciones

- Detalles de transacciones
- Historial de transacciones
- Ganancias en inversiones
- Gastos discriminados por categoría

## Tecnologías

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
<!-- - [Python](https://www.python.org/) -->

## Estructura de directorios

- `api/`: Directorio para la API RESTful con Python.
  <!-- - `controllers/`: Controladores de la API RESTful. -->
- `app/`: Directorio para la aplicación React.
- `public/`: Directorio para archivos estáticos.
- `styles/`: Directorio para archivos de estilo.

## Pantallas

## Database Structure

### Table `Users`

| Column Name | Type      | Description                    |
| ----------- | --------- | ------------------------------ |
| user_id     | UUID      | ID del usuario                 |
| username    | string    | Nombre de usuario              |
| email       | string    | Correo electrónico del usuario |
| image_url   | string    | URL de la imagen del usuario   |
| created_at  | timestamp | Fecha de creación del usuario  |

### Table `Accounts`

| Column Name | Type      | Description                                  |
| ----------- | --------- | -------------------------------------------- |
| account_id  | UUID      | ID de la cuenta                              |
| user_id     | UUID      | Referencia al ID del usuario                 |
| name        | string    | Nombre de la cuenta                          |
| balance     | decimal   | Saldo actual de la cuenta                    |
| created_at  | timestamp | Fecha de creación de la cuenta               |
| hex_code    | string    | Código de color hexagonal único de la cuenta |

### Table `Transactions`

| Column Name          | Type      | Description                                           |
| -------------------- | --------- | ----------------------------------------------------- |
| transaction_id       | UUID      | ID de la transacción                                  |
| account_id           | UUID      | Referencia al ID de la cuenta                         |
| amount               | decimal   | Monto de la transacción                               |
| transaction_type     | string    | Tipo de transacción (ingreso o gasto)                 |
| created_at           | timestamp | Fecha y hora de la creación de la transacción         |
| transaction_category | string    | Categoría de la transacción                           |
| currency             | string    | Código de la moneda (por ejemplo, USD, ARS, BTC, ETH) |

### Table `Quotas`

| Column Name       | Type      | Description                                              |
| ----------------- | --------- | -------------------------------------------------------- |
| quota_id          | UUID      | ID de la cuota                                           |
| user_id           | UUID      | Referencia al ID del usuario                             |
| account_id        | UUID      | Referencia al ID de la cuenta a la que se le corresponde |
| amount            | decimal   | Monto a pagar por la cuota                               |
| quota_type        | string    | Tipo de cuota (diaria, mensual, anual)                   |
| quota_quantity    | integer   | Cantidad de cuotas restantes, NULL si es indeterminada   |
| quota_category    | string    | Categoría de la cuota                                    |
| next_payment_date | timestamp | Fecha del próximo pago programado                        |
| created_at        | timestamp | Fecha y hora de creación de la cuota                     |
| finished          | boolean   | Indicador de si todas las cuotas han sido pagadas        |

### Table `Crypto_Transaction_Details`

| Column Name                  | Type    | Description                                                                 |
| ---------------------------- | ------- | --------------------------------------------------------------------------- |
| crypto_transaction_detail_id | UUID    | ID único para el detalle de la transacción de criptomoneda                  |
| transaction_id               | UUID    | Referencia al ID de la transacción de la tabla `Transactions`               |
| usd_price                    | decimal | Precio en USD de la criptomoneda en el momento de la compra                 |
| usd_total                    | decimal | Valor total gastado en la transacción en USD                                |
| fee                          | decimal | Comisión de la transacción si aplica (por ejemplo, comisión de intercambio) |
