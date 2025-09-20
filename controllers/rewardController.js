const { User, Voucher, RedeemedVoucher, DiamondTransaction, sequelize } = require('../models');

async function getAllVouchers(req, res) {
  try {
    const vouchers = await Voucher.findAll({
      where: { is_active: true },
      attributes: ['voucher_id', 'name', 'description', 'cost', 'voucher_img']
    });
    res.status(200).json(vouchers);
  } catch (err) {
    console.error("getAllVouchers error", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getVoucherById(req, res) {
    try {
      const { voucher_id } = req.params;
      const voucher = await Voucher.findOne({
        where: { voucher_id, is_active: true },
        attributes: ['voucher_id', 'name', 'description', 'cost', 'voucher_img']
      });

      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found or is not active" });
      }
      res.status(200).json(voucher);
    } catch (err) {
      console.error("getVoucherById error", err);
      res.status(500).json({ message: "Server error" });
    }
}

async function redeemVoucher(req, res) {
  const t = await sequelize.transaction();
  try {
    const { voucher_id } = req.params;
    const user_id = req.user.id;

    const voucher = await Voucher.findByPk(voucher_id, { transaction: t });
    if (!voucher) {
      await t.rollback();
      return res.status(404).json({ message: "Voucher not found" });
    }
    if (!voucher.is_active) {
      await t.rollback();
      return res.status(400).json({ message: "This voucher is no longer active" });
    }

    const user = await User.findByPk(user_id, { transaction: t, lock: true });

    if (user.diamond_balance < voucher.cost) {
      await t.rollback();
      return res.status(400).json({ message: "Not enough diamonds to redeem this voucher" });
    }

    await user.decrement({ diamond_balance: voucher.cost }, { transaction: t });

    await DiamondTransaction.create({
      user_id,
      amount: -voucher.cost, 
      transaction_type: 'voucher_redeem',
      source_id: voucher.voucher_id,
    }, { transaction: t });

    const redemption = await RedeemedVoucher.create({
      user_id,
      voucher_id,
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Voucher redeemed successfully!", redemption });
  } catch (err) {
    await t.rollback();
    console.error("redeemVoucher error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  getAllVouchers,
  getVoucherById,
  redeemVoucher,
};