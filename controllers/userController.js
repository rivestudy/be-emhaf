const { User, DiamondTransaction, RedeemedVoucher, Voucher } = require('../models');

async function getMyProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id', 'username', 'full_name', 'email', 'diamond_balance', 'user_img'],
    });
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('getMyProfile error', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}

async function getMyTransactionHistory(req, res) {
  try {
    const transactions = await DiamondTransaction.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(transactions);
  } catch (err) {
    console.error('getMyTransactionHistory error', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}

async function getMyRedeemedVouchers(req, res) {
  try {
    const redemptions = await RedeemedVoucher.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Voucher,
          as: 'voucher',
          attributes: ['name', 'description', 'voucher_img', 'cost'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(redemptions);
  } catch (err) {
    console.error('getMyRedeemedVouchers error', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads');
const fs = require('fs').promises;

async function editMyProfile(req, res) {
  try {
    const userId = req.body.user_id || req.user.id;
    const { full_name, email, user_img } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    let finalUserImg = user.user_img;
    let oldFileToDelete = null;

    if (req.file) {
      if (user.user_img && user.user_img.startsWith('/cdn/')) {
        const oldFilename = user.user_img.replace('/cdn/', '');
        oldFileToDelete = path.join(uploadDir, oldFilename);
      }
      finalUserImg = `/cdn/${req.file.filename}`;
    } 
    else if (user_img) {
      if (user_img.startsWith('/cdn/')) {
        finalUserImg = user_img;
      } else {
        finalUserImg = `/cdn/${path.basename(user_img)}`;
      }
    }

    await user.update({
      full_name: full_name || user.full_name,
      email: email || user.email,
      user_img: finalUserImg,
    });

    if (oldFileToDelete) {
      try {
        await fs.unlink(oldFileToDelete);
        console.log('Old image deleted:', oldFileToDelete);
      } catch (err) {
        if (err.code !== 'ENOENT') console.error('Failed to delete old image:', err);
      }
    }

    res.status(200).json({
      message: 'Profil berhasil diperbarui.',
      user,
    });
  } catch (err) {
    console.error('editMyProfile error', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}

module.exports = {
  editMyProfile,
  getMyProfile,
  getMyTransactionHistory,
  getMyRedeemedVouchers,
};
