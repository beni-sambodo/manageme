const permissions = {
  school: {
    all: '*-school',
    update: 'update-school',
    delete: 'delete-school',
  },
  employer: {
    all: '*-employer',
    send: 'send_invite-employer',
    sent: 'sent_invite-employer',
    status: 'status-employer', // for change status
    update: 'update-employer', // for update
    delete: 'delete-employer', // for delete
  },
  course_category: {
    all: '*-course_category',
    create: 'create-course_category',
    update: 'update-course_category',
    delete: 'delete-course_category',
  },
  course: {
    all: '*-course',
    create: 'create-course',
    update: 'update-course',
    delete: 'delete-course',
  },
  group: {
    all: '*-group',
    create: 'get-group',
    create: 'create-group',
    update: 'update-group',
    delete: 'delete-group',
    status: 'status-group',
  },
  room: {
    all: '*-room',
    create: 'create-room',
    update: 'update-room',
    delete: 'delete-room',
  },
  //deleted memory
  position: {
    all: '*-position',
    create: 'create-position',
    update: 'update-position',
    delete: 'delete-position',
  },
  attendance: {
    all: '*-attendance',
    create: 'create-attendance',
    getOne: 'get_one-attendance', // get one day's attandance
    attent: 'attent-attendance', // update attendance > student
    end: 'end-attendance', // update attendance > student
    dealWithEndedAttendances: 'deal-with-ended-attendances'
  },
  reception: {
    all: '*-reception',
    new_student: 'new_student-reception',
  },
  user: {
    all: '*-user',
    full_data_get: 'get_full_data-user', // get user's full data
  },
  statistics: {
    all: '*-statistics', //statistiks
    get: 'get-statistics',
  },
  studentPayment: {
    all: '*-student_payment', //student_payment
    pay: 'pay-student_payment',
    discount: 'discount-student_payment',
  },
  transactionType: {
    all: '*-transaction_type', //transaction type
    create: 'create-transaction_type',
    update: 'update-transaction_type',
    delete: 'delete-transaction_type',
  },
}
export default permissions
