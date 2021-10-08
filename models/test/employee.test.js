const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should not throw an error if all data is correct', () => {
    const emp = new Employee({firstName: 'John', lastName: 'Doe', department: '155463'});

    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });

  it('should throw an error if there is no arguments at all', () => {
    const emp = new Employee({});

    emp.validate(err => {
      expect(err).to.exist;
    });
  });

  it('should throw an error if there is no "firstName" argument', () => {
    const emp = new Employee({firstName:{}, lastName: 'Doe', department: '155463'});

    emp.validate(err => {
      expect(err).to.exist;
    });
  });

  it('should throw an error if there is no "lastName" argument', () => {
    const emp = new Employee({firstName: 'John', lastName:{}, department: '155463'});

    emp.validate(err => {
      expect(err).to.exist;
    });
  });

  it('should throw an error if there is no "department" argument', () => {
    const emp = new Employee({firstName: 'John', lastName: 'Doe', department:{}});

    emp.validate(err => {
      expect(err).to.exist;
    });
  });

  it('should throw an error if any of the arguments are not a string', () => {
    const cases = [{ firstName: 'John', lastName: 'Doe', department:{id: '123123', name: 'Management' }},
                   { firstName: 'John', lastName: {first: 'Doe', second: 'Amber'}, department:'1231234' },
                   { firstName: ['John', 'Adam'], lastName: 'Doe', department:'1231234' },
                  ];
    for (let name of cases) {
        const emp = new Employee(name)

        emp.validate(err => {
          expect(err).to.exist;
        });
    }
  });


  after(() => {
    mongoose.models = {};
  });

});
