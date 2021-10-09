const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
   before(async () => {
     const testEmpOne = new Employee({firstName: 'John', lastName: 'Doe', department: '155463'});
     await testEmpOne.save();

     const testEmpTwo = new Employee({firstName: 'Amanda', lastName: 'Amber', department: '344567'});
     await testEmpTwo.save();
   });

   it('should return all the data with "find" method', async () => {
     const employees = await Employee.find();
     const expectedLength = 2;
     expect(employees.length).to.be.equal(expectedLength);
   });

   it('should return proper document by various params with findOne method.', async () => {
    const firstNameTest = await Employee.findOne({ firstName: 'John' });
    const lastNameTest = await Employee.findOne({ lastName: 'Amber' });
    const employeeTest = await Employee.findOne({ department: '344567' });

    expect(firstNameTest.firstName).to.be.equal('John');
    expect(lastNameTest.lastName).to.be.equal('Amber');
    expect(employeeTest.firstName).to.be.equal('Amanda');

   });

   after(async () => {
    await Employee.deleteMany();
   });

  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({firstName: 'John', lastName: 'Doe', department: '155463'});
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({firstName: 'John', lastName: 'Doe', department: '155463'});
      await testEmpOne.save();

      const testEmpTwo = new Employee({firstName: 'Amanda', lastName: 'Amber', department: '344567'});
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: 'Jake' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'Jake' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John'  });
      employee.firstName = 'Jake';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Jake'});
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find();
      for (let employee of employees) {
        expect(employee.firstName).to.equal('Updated!');
      }

    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({firstName: 'John', lastName: 'Doe', department: '155463'});
      await testEmpOne.save();

      const testEmpTwo = new Employee({firstName: 'Amanda', lastName: 'Amber', department: '344567'});
      await testEmpTwo.save();
    });


    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const removeEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.equal(0);

    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Populating data', () => {
    before( async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
      const department = await Department.findOne({ name: 'Department #1' });

      const testEmpOne = new Employee({firstName: 'John', lastName: 'Doe', department: department._id});
      await testEmpOne.save();
    });

    it('should properly render data from another object when using "populate"', async () => {


      const department = await Department.findOne({ name: 'Department #1' });
      const employee = await Employee.findOne({ firstName: 'John' }).populate('department');

      expect(employee.department.id).to.equal(department.id);
      expect(employee.department.name).to.equal('Department #1');

    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
});
