const { User, Voucher, RedeemedVoucher, DiamondTransaction, sequelize } = require('../models');

async function getAllVouchers(req, res) {
  try {
    const vouchers = await Voucher.findAll({
      where: { is_active: true },
      attributes: ['voucher_id', 'name', 'description', 'cost', 'voucher_img'],
    });
    res.status(200).json(vouchers);
  } catch (err) {
    console.error("getAllVouchers error", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

async function getVoucherById(req, res) {
  try {
    const { voucher_id } = req.params;
    const voucher = await Voucher.findOne({
      where: { voucher_id, is_active: true },
      attributes: ['voucher_id', 'name', 'description', 'cost', 'voucher_img'],
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher tidak ditemukan atau sudah tidak aktif." });
    }
    res.status(200).json(voucher);
  } catch (err) {
    console.error("getVoucherById error", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

async function redeemVoucher(req, res) {
  try {
    const { voucher_id } = req.params;
    const user_id = req.user.id;

    const result = await sequelize.transaction(async (t) => {
      const voucher = await Voucher.findByPk(voucher_id, { transaction: t });
      if (!voucher) throw new Error("Voucher tidak ditemukan.");
      if (!voucher.is_active) throw new Error("Voucher ini sudah tidak aktif.");

      const user = await User.findByPk(user_id, { transaction: t, lock: true });
      if (user.diamond_balance < voucher.cost) {
        throw new Error("Saldo diamond Anda tidak cukup untuk menukarkan voucher ini.");
      }

      await user.decrement({ diamond_balance: voucher.cost }, { transaction: t });

      await DiamondTransaction.create(
        {
          user_id,
          amount: -voucher.cost,
          transaction_type: "voucher_redeem",
          source_id: voucher.voucher_id,
        },
        { transaction: t }
      );

      const redemption = await RedeemedVoucher.create(
        { user_id, voucher_id },
        { transaction: t }
      );

      return redemption;
    });

    res.status(200).json({
      message: "Voucher berhasil ditukarkan!",
      redemption: result,
    });
  } catch (err) {
    console.error("redeemVoucher error", err);
    res.status(500).json({ message: err.message || "Terjadi kesalahan pada server." });
  }
}

async function claimVoucher(req, res) {
  try {
    const { redemption_id } = req.params;
    const user_id = req.user.id;

    const result = await sequelize.transaction(async (t) => {
      const redemption = await RedeemedVoucher.findOne({
        where: { redemption_id, user_id },
        transaction: t,
        lock: true,
      });

      if (!redemption) throw new Error("Voucher yang ditebus tidak ditemukan.");
      if (redemption.voucher_status === true) throw new Error("Voucher sudah diklaim sebelumnya.");

      redemption.voucher_status = true;
      await redemption.save({ transaction: t });

      return redemption;
    });

    res.status(200).json({
      message: "Voucher berhasil diklaim!",
      redemption: result,
    });
  } catch (err) {
    console.error("claimVoucher error", err);
    res.status(500).json({ message: err.message || "Terjadi kesalahan pada server." });
  }
}

module.exports = {
  getAllVouchers,
  getVoucherById,
  redeemVoucher,
  claimVoucher,
};
