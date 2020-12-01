//create new database
console.log('hit db.js');
let db;
//db name and version #
const request = indexedDB.open("budget", 2);

//create object store on upgrade
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

//successful database connection
request.onsuccess = (event) => {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

//database connection error
request.onerror = (event) => {
    console("Error connecting to database: ", event.target.errorCode);
}

//function to save a transaction record to the database
function saveRecord(record) {
    //create transaction with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    //access objectStore
    const store = transaction.objectStore("pending");

    //add record
    store.add(record);
}

//function to check database transactions
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    //get all records
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.store("pending");
                    store.clear();
                });
        }
    };
}

//check if online
window.addEventListener("online", checkDatabase);