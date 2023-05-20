const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");


module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const voucher = await Voucher.find();
      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render("admin/voucher/create", {
        category,
        nominal
      });

    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, category, nominal } = req.body;

      if(req.file){
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let filename = req.file.filename + '.' + originalExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        
        src.pipe(dest);
        src.on('end', async () => {
          try {
            const voucher = await Voucher({ name, category, nominal, thumbnail: filename });
            await voucher.save();

            req.flash("alertMessage", "Berhasil tambah voucher");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
            
        })
      }else{
        const voucher = await Voucher({ name, category, nominal });
        await voucher.save();

        req.flash("alertMessage", "Berhasil tambah voucher");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  // viewEdit: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const voucher = await voucher.findOne({ _id: id });
  //     res.render("admin/voucher/edit", { voucher });
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/voucher");
  //   }
  // },

  //   actionEdit: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const { coinName, coinQuantity, price } = req.body;
  //       await voucher.findOneAndUpdate(
  //         {
  //           _id: id,
  //         },
  //         { coinName, coinQuantity, price },
  //       );

  //       req.flash("alertMessage", "Berhasil ubah voucher");
  //       req.flash("alertStatus", "success");

  //       res.redirect("/voucher");
  //     } catch (err) {
  //       req.flash("alertMessage", `${err.message}`);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/voucher");
  //     }
  //   },

  //   actionDelete: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       await voucher.findOneAndRemove({
  //         _id: id,
  //       });

  //       req.flash("alertMessage", "Berhasil hapus voucher");
  //       req.flash("alertStatus", "success");

  //       res.redirect("/voucher");
  //     } catch (err) {
  //       req.flash("alertMessage", `${err.message}`);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/voucher");
  //     }
  //   },
};
