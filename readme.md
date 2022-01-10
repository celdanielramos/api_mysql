# Api

My solution for the test

## DB

The file "db.sql" contains the structure of both tables + the initial data for transactions.

## Configuration

Replace the values in the file .env accordinly to your server.

## Code

Clone the repo and run 

```bash
npm install
npm run dev
or
npm start
```

## Usage

The repo contains a Postman collection in that we could see 5 endpoints

```
transaction
- GET transaction = all transactions paginated
- GET transaction/:uuid = 1 transaction

paymentnote
- GET paymentnote = all paymentnotes paginated
- GET paymentnote/:uuid = 1 paymentnote with all the transactions related
- POST paymentnote = create a new paymentnote and relate the transactions involve
```

The name of the file is: test.postman_collection.json

## Questions

- This endpoint could take a long time to run if the amount of transaction included in the range is huge. Also, maybe it would be paginated the massive update to not consume all the memory. For example, Sequelize died trying to run a massive update.

- The bottleneck is the relation with the transactions. So, we could answer quickly to the user with the "payment_note_uuid" and send a message to a queue that process all the transactions and mark the paymentnote as completed. When this process finish, we could ping back the user saying to let him know the process has finished.

- The things that would change are:
-- implement a client for a queue service
-- remove the code from the POST endpoint related with updating the transactions and the paymentnotes. This has to be managed by a worker in the queue.

