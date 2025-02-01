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

| Column Name         | Type      | Description                    |
| ------------------- | --------- | ------------------------------ |
| user_id             | UUID      | ID del usuario                 |
| username            | string    | Nombre de usuario              |
| email               | string    | Correo electrónico del usuario |
| image_url           | string    | URL de la imagen del usuario   |
| created_at          | timestamp | Fecha de creación del usuario  |
| preference_currency | string    | Moneda preferida del usuario   |

### Table `Accounts`

| Column Name  | Type      | Description                                  |
| ------------ | --------- | -------------------------------------------- |
| account_id   | UUID      | ID de la cuenta                              |
| user_id      | UUID      | Referencia al ID del usuario                 |
| name         | string    | Nombre de la cuenta                          |
| account_type | decimal   | Tipo de cuenta (general, crypto, etc.)       |
| created_at   | timestamp | Fecha de creación de la cuenta               |
| hex_code     | string    | Código de color hexagonal único de la cuenta |

### Table `Transactions`

| Column Name             | Type      | Description                                           |
| ----------------------- | --------- | ----------------------------------------------------- |
| transaction_id          | UUID      | ID de la transacción                                  |
| account_id              | UUID      | Referencia al ID de la cuenta                         |
| transaction_description | string    | Descripción de la transacción                         |
| transaction_type        | string    | Tipo de transacción (ingreso o gasto)                 |
| transaction_category    | string    | Categoría de la transacción                           |
| transaction_subcategory | string    | Subcategoría de la transacción                        |
| amount                  | decimal   | Monto de la transacción                               |
| created_at              | timestamp | Fecha y hora de la creación de la transacción         |
| currency_id             | string    | Código de la moneda (por ejemplo, USD, ARS, BTC, ETH) |
| transfer_id             | UUID      | ID de la transferencia                                |
| quota_id                | UUID      | ID de la cuota                                        |

### Table `Transfers`

| Column Name           | Type      | Description                                     |
| --------------------- | --------- | ----------------------------------------------- |
| transfer_id           | UUID      | ID de la transferencia                          |
| exchange_rate         | decimal   | Tasa de cambio de la transacción                |
| created_at            | timestamp | Fecha y hora de la creación de la transferencia |
| source_transaction_id | UUID      | ID de la transacción de origen                  |
| target_transaction_id | UUID      | ID de la transacción de destino                 |

### Table `Quotas`

| Column Name       | Type      | Description                                              |
| ----------------- | --------- | -------------------------------------------------------- |
| quota_id          | UUID      | ID de la cuota                                           |
| user_id           | UUID      | Referencia al ID del usuario                             |
| account_id        | UUID      | Referencia al ID de la cuenta a la que se le corresponde |
| quota_name        | string    | Nombre de la cuota                                       |
| quota_type        | string    | Tipo de cuota (diaria, mensual, anual)                   |
| quota_quantity    | integer   | Cantidad de cuotas restantes, NULL si es indeterminada   |
| quota_category    | string    | Categoría de la cuota                                    |
| quuoa_subcategory | string    | Subcategoría de la cuota                                 |
| amount            | decimal   | Monto a pagar por la cuota                               |
| quota_currency    | string    | Moneda de la cuota                                       |
| start_date        | timestamp | Fecha del inicio del periodo de cuotas                   |
| next_payment_date | timestamp | Fecha del próximo pago programado                        |
| created_at        | timestamp | Fecha y hora de creación de la cuota                     |
| status            | string    | Estado de la cuota (pendiente, pagada, cancelada)        |

### Table `Crypto_Transaction_Details`

| Column Name                  | Type    | Description                                                   |
| ---------------------------- | ------- | ------------------------------------------------------------- |
| crypto_transaction_detail_id | UUID    | ID único para el detalle de la transacción de criptomoneda    |
| transaction_id               | UUID    | Referencia al ID de la transacción de la tabla `Transactions` |
| usd_price                    | decimal | Precio en USD de la criptomoneda en el momento de la compra   |

### Table `Currencies`

| Column Name   | Type   | Description                   |
| ------------- | ------ | ----------------------------- |
| currency_id   | string | Código de la moneda           |
| currency_name | string | Nombre de la moneda           |
| image_url     | string | URL de la imagen de la moneda |
| currency_type | string | Tipo de moneda (fiat, crypto) |

### Table `Currency_Exchange_Rates`

| Column Name   | Type      | Description                      |
| ------------- | --------- | -------------------------------- |
| from_curr     | string    | Código de la moneda de origen    |
| to_curr       | string    | Código de la moneda de destino   |
| exchange_rate | decimal   | Tasa de cambio                   |
| last_update   | timestamp | Fecha de la última actualización |
