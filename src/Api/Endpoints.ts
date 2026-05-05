
const endpoints = {
    auth: {
    login: '/api/auth/login',
    password: '/api/auth/sendpassword'
  },
  nicheOccupants: {
    insertOccupant: '/api/nicheoccupants',
    getOccupant: '/api/nicheoccupants',
    updateOccupant: '/api/nicheoccupants/{id}'
   },
  niche: {
    addNiche: '/api/niches',
    getNiches: '/api/niches',
    getNicheById: '/api/niches/{id}',  
    updateNiche: '/api/niches/{id}'
  },
  payments: {
    addPayment: '/api/payments',
    getPayments: '/api/payments', 
    updatePayment: '/api/payments/{id}'
  },
  users: {
    updateUser: '/api/users/{id}', 
    userInfo: '/api/usuario/login'
  }
};

export default endpoints;
