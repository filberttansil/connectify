'use strict';
const fs = require('fs')
const bcrypt = require('bcryptjs')

const data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))

data.forEach(el=>{
  delete el.id
  el.createdAt = new Date()
  el.updatedAt = new Date()

  const salt = bcrypt.genSaltSync(8)
  const hash = bcrypt.hashSync(el.password, salt)
  el.password = hash

})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   return queryInterface.bulkInsert("Users", data,{} )
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null )
  }
};
