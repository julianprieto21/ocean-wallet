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

## Estructura de directorios

- `.github/workflows/`: Directorio para los scripts de GitHub Actions.
- `app/`: Directorio para la aplicación React.
  - `api/`: Directorio para la API RESTful con Python.
  - `[locale]/`: Directorio para la traducción de la aplicación.
- `i18n/`: Directorio para archivos de traducción.
- `lib/`: Directorio para archivos de código reutilizable.
- `public/`: Directorio para archivos estáticos.

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

| Column Name | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| account_id  | UUID      | ID de la cuenta                       |
| user_id     | UUID      | Referencia al ID del usuario          |
| name        | string    | Nombre de la cuenta                   |
| type        | decimal   | Tipo de cuenta (wallet, crypto, etc.) |
| created_at  | timestamp | Fecha de creación de la cuenta        |
| provider    | string    | Proveedor de la cuenta                |

### Table `Transactions`

| Column Name    | Type      | Description                                           |
| -------------- | --------- | ----------------------------------------------------- |
| transaction_id | UUID      | ID de la transacción                                  |
| account_id     | UUID      | Referencia al ID de la cuenta                         |
| description    | string    | Descripción de la transacción                         |
| type           | string    | Tipo de transacción (ingreso o gasto)                 |
| category       | string    | Categoría de la transacción                           |
| subcategory    | string    | Subcategoría de la transacción                        |
| amount         | decimal   | Monto de la transacción                               |
| created_at     | timestamp | Fecha y hora de la creación de la transacción         |
| currency_id    | string    | Código de la moneda (por ejemplo, USD, ARS, BTC, ETH) |
| transfer_id    | UUID      | ID de la transferencia                                |
| quota_id       | UUID      | ID de la cuota                                        |

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
| name              | string    | Nombre de la cuota                                       |
| type              | string    | Tipo de cuota (diaria, mensual, anual)                   |
| quantity          | integer   | Cantidad de cuotas restantes, NULL si es indeterminada   |
| category          | string    | Categoría de la cuota                                    |
| subcategory       | string    | Subcategoría de la cuota                                 |
| amount            | decimal   | Monto a pagar por la cuota                               |
| currency_id       | string    | Moneda de la cuota                                       |
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

| Column Name | Type   | Description                   |
| ----------- | ------ | ----------------------------- |
| currency_id | string | Código de la moneda           |
| name        | string | Nombre de la moneda           |
| type        | string | Tipo de moneda (fiat, crypto) |

### Table `Currency_Exchange_Rates`

| Column Name   | Type      | Description                      |
| ------------- | --------- | -------------------------------- |
| from_curr     | string    | Código de la moneda de origen    |
| to_curr       | string    | Código de la moneda de destino   |
| exchange_rate | decimal   | Tasa de cambio                   |
| last_update   | timestamp | Fecha de la última actualización |
