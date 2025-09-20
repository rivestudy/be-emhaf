const express = require('express');
const router = express.Router();
const { getMyProfile, getMyTransactionHistory, getMyRedeemedVouchers } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/profile', getMyProfile);
router.get('/transactions', getMyTransactionHistory);
router.get('/redeemed-vouchers', getMyRedeemedVouchers);

module.exports = router;