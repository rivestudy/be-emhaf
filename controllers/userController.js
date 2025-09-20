const { User, DiamondTransaction, RedeemedVoucher, Voucher } = require('../models');

async function getMyProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id', 'username', 'full_name', 'email', 'diamond_balance']
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("getMyProfile error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getMyTransactionHistory(req, res) {
  try {
    const transactions = await DiamondTransaction.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("getMyTransactionHistory error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getMyRedeemedVouchers(req, res) {
    try {
        const redemptions = await RedeemedVoucher.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Voucher,
                as: 'voucher',
                attributes: ['name', 'description']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(redemptions);
    } catch (err) {
        console.error("getMyRedeemedVouchers error", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
  getMyProfile,
  getMyTransactionHistory,
  getMyRedeemedVouchers,
};