var fs = require('fs');
var flatbuffers = require('flatbuffers').flatbuffers;
var Person = require('./person-schema_generated').Person;

//Create Person object write it to file
var fileName = 'person.data';
createPersonAndWriteToFile(fileName);

// Read file and print data
var deserializedPerson = readFile(fileName);

console.log(`
  Name : ${deserializedPerson.name()}
  Age : ${deserializedPerson.age()}

  Spouse Name : ${deserializedPerson.spouse().name()}
  Spouse Age : ${deserializedPerson.spouse().age()}
  `)

function createPersonAndWriteToFile(fileName) {
    var builder = new flatbuffers.Builder();

    var spouseName = builder.createString('Mrs Vikram');
    Person.startPerson(builder);
    Person.addName(builder, spouseName);
    Person.addAge(builder, 30);
    var spouseOffset = Person.endPerson(builder);

    var name = builder.createString('Vikram');
    Person.startPerson(builder);
    Person.addName(builder, name);
    Person.addAge(builder, 34);
    Person.addSpouse(builder, spouseOffset)
    var person = Person.endPerson(builder);
    builder.finish(person);

    fs.writeFileSync(fileName, builder.asUint8Array().toString());
}

function readFile(name) {
    var stringData = fs.readFileSync(name).toString();
    var data = Uint8Array.from(stringData.split(','));
    var bb = new flatbuffers.ByteBuffer(data);
    return Person.getRootAsPerson(bb);
}
