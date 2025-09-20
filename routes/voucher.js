const express = require('express');
const router = express.Router();
const { getAllVouchers, getVoucherById, redeemVoucher } = require('../controllers/rewardController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/', getAllVouchers);
router.get('/:voucher_id', getVoucherById);
router.post('/:voucher_id/redeem', redeemVoucher);

module.exports = router;