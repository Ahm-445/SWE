const { validationResult } = require('express-validator');

const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // إرجاع رسالة خطأ واضحة في حال كانت المدخلات غير صالحة
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next(); // تمرير الطلب للمسار إذا كانت المدخلات سليمة
};

module.exports = validateInputs;