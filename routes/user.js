const express = require('express');
const router = express.Router();
const { getMyProfile, getMyTransactionHistory, getMyRedeemedVouchers, editMyProfile} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload } = require('../controllers/cdnController');

router.use(authenticateToken);
router.get('/profile', getMyProfile);
router.get('/transactions', getMyTransactionHistory);
router.get('/redeemed-vouchers', getMyRedeemedVouchers);
router.put('/profile', upload.single('user_img'), editMyProfile);

module.exports = router;