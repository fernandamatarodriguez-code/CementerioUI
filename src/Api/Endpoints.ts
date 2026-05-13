
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
    allocateNiche: '/api/niches',
    getNiches: '/api/niches',
    getNicheById: '/api/niches',  
    updateNiche: '/api/niches/{id}'
  },
  payments: {
    addPayment: '/api/payments',
    getPayments: '/api/payments', 
    updatePayment: '/api/payments/{id}',
    getDocument: '/api/payments/{id}/document'
  },
  users: {
    updateUser: '/api/users/{id}', 
    userInfo: '/api/usuario/login'
  }
};

export default endpoints;
