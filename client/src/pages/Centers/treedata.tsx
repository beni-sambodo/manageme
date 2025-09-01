const Permissions: any = {
  school: {
    all: "*-school",
    update: "update-school",
    delete: "delete-school",
  },
  employer: {
    all: "*-employer",
    send: "send_invite-employer",
    sent: "sent_invite-employer",
    status: "status-employer",
    update: "update-employer",
    delete: "delete-employer",
  },
  course_category: {
    all: "*-course_category",
    create: "create-course_category",
    update: "update-course_category",
    delete: "delete-course_category",
  },
  course: {
    all: "*-course",
    create: "create-course",
    update: "update-course",
    delete: "delete-course",
  },
  group: {
    all: "*-group",
    get: "get-group",
    create: "create-group",
    update: "update-group",
    delete: "delete-group",
    status: "status-group",
  },
  room: {
    all: "*-room",
    create: "create-room",
    update: "update-room",
    delete: "delete-room",
  },
  position: {
    all: "*-position",
    create: "create-position",
    update: "update-position",
    delete: "delete-position",
  },
  attendance: {
    all: "*-attendance",
    create: "create-attendance",
    getOne: "get_one-attendance", // get one day's attendance
    attent: "attent-attendance", // update attendance > student
    end: "end-attendance", // update attendance > student
    ended: "deal-with-ended-attendances"
  },
  reception: {
    all: "*-reception",
    new_student: "new_student-reception",
  },
  user: {
    all: "*-user",
    full_data_get: "get_full_data-user", // get user's full data
  },
  statistics: {
    all: "*-statistics", //statistics
    get: "get-statistics",
  },
  studentPayment: {
    all: "*-student_payment", //student payment
    pay: "pay-student_payment",
    discount: "discount-student_payment",
  },
  transactionType: {
    all: "*-transaction_type", //transaction type
    create: "create-transaction_type",
    update: "update-transaction_type",
    delete: "delete-transaction_type",
  },
};
export default Permissions;
