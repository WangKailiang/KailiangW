/*
 * date: 2017/10/17;
 * author: Wang-Kaiiang;
 * company: Mascot Dokky;
 * email: kailiangoffice@gmail.com
 */

function indexedDb(){
    this.dbName="";
    this.version = 1;
    this.indexs = [];
    this.storeNames = [];
    this.db = null;
};

indexedDb.prototype.OpenDb= function(name, version, storeName){

    var version=version || 1;
    var request=window.indexedDB.open(name, version);
    request.onerror=function(e){
        console.log(e.currentTarget.error.message);
    };
    request.onsuccess=function(e){
        myDB.db=e.target.result;
        console.log("open:" + name + "success");
    };
    request.onupgradeneeded=function(e){
        var db=e.target.result;
        if(!db.objectStoreNames.contains(storeName)){
            var objectStore = db.createObjectStore(storeName, {keyPath: "index"});
            objectStore.createIndex("index", "index", { unique: true });
        }

        console.log('DB version changed to '+version);
    };
};
indexedDb.prototype.addData = function(db, storeName, jData){
    var transaction=db.transaction(storeName,'readwrite');
    var store=transaction.objectStore(storeName);
    store.clear();
    for(var i=0;i<jData.length;i++){
        store.add(jData[i]);
    }
};

indexedDb.prototype.getDataByIndex = function(db, indexname, idx, storeName){
    var transaction=db.transaction(storeName, 'readwrite');
    var objectStore=transaction.objectStore(storeName);
    var index = objectStore.index(indexname);
    var res = index.get(idx);

    res.onsuccess = function(event) {
        console.log("open db success!");
        //Do Something
    };
    res.onerror = function (event) {
        console.log(event.target.errorCode);
    }
};

indexedDb.prototype.deleteDb = function(dbName){
    indexedDB.deleteDatabase(dbName);
};

indexedDb.prototype.closeDb = function(db){
    db.close();
};

indexedDb.prototype.updateDataByKey = function(db, storeName, value){
    var transaction=db.transaction(storeName,'readwrite');
    var store=transaction.objectStore(storeName);
    var request=store.get(value);

    request.onsuccess=function(e){
        var student=e.target.result;
        student.age=35;
        store.put(student);
    };
};

indexedDb.prototype.fetchStoreByCursor = function(db, storeName){
    var transaction = db.transaction(storeName);
    var store = transaction.objectStore(storeName);
    var res = store.openCursor();
    res.onsuccess = function(e){
        var cursor = e.target.result;
        if(cursor){
            var data = cursor.value;
            cursor.continue();
        }
    };
    res.error = function(e){
        console.log(e.target.errorCode);
    };
};