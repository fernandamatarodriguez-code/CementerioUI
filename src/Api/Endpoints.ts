
const endpoints = {
    auth: {
    login: '/api/auth/login',
    password: '/api/auth/sendpassword'
  },
  nicheOccupants: {
    insertOccupant: '/api/nicheoccupants',
    getOccupant: '/api/nicheoccupants',
    updateOccupant: '/api/nicheoccupants',
    deleteOccupant: '/api/nicheoccupants'
   },
  niche: {
    addNiche: '/api/niches',
    allocateNiche: '/api/niches',
    getNiches: '/api/niches',
    getNicheById: '/api/niches',  
    updateNiche: '/api/niches',
    deleteNiche: '/api/niches'
  },
  payments: {
    addPayment: '/api/payments',
    getPayments: '/api/payments', 
    updatePayment: '/api/payments/{id}'
  },
  users: {
    updateUser: '/api/users', 
    userInfo: '/api/usuario/login'
  },
  nichesMain: {
    addNiche: '/api/nichesMain',
    getNiches: '/api/nichesMain',
    getNicheById: '/api/nichesMain',  
    updateNiche: '/api/nichesMain',
  }
};

export default endpoints;
