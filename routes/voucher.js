const express = require('express');
const router = express.Router();
const { getAllVouchers, getVoucherById, redeemVoucher, claimVoucher } = require('../controllers/rewardController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/', getAllVouchers);
router.get('/:voucher_id', getVoucherById);
router.post('/:voucher_id/redeem', redeemVoucher);
router.post('/:redemption_id/claim', claimVoucher);

module.exports = router;