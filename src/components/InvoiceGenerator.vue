<template>
  <div class="invoice-container">
    <div class="preview-download">
      <div class="preview_button">
        <div>
          <button @click="togglePreview">
        {{ preview ? "Edit" : "Preview" }}
      </button>
      <p v-if="checkRateandDescription" style="color: red">Please filled the Rate </p>
        </div>
      <button @click="printAndClose" v-if="preview">print</button>
      </div>

      <div class="photo-drop" v-if="!preview">
        <label class="select-img-symbol" v-if="!selectedImage">
          <input
            type="file"
            @change="handleImageChange"
            accept="image/*"
            class="select-img"
            ref="imageInput"
          />
          <img src="../assets/images.svg" alt="no-img" class="select-img-symbol-icon" />
          <span>+logo</span>
        </label>
        <img v-if="selectedImage" :src="selectedImage" alt="Selected Logo" class="logo-img" />
        <div class="remove-logo" v-if="selectedImage" @click="removeLogo">
          <span class="remove-logo-icon">X</span>
        </div>
        <div class="add-logo-message" v-if="!selectedImage">
          <span class="guide-message" >
            Add your logo
          </span>
        </div>
      </div>
    </div>
    <div v-if="!preview" class="invoice-form">
      <div class="select-currency-unit">
        <input
          type="text"
          v-model="invoiceTitle"
          class="invoice-title-input"
          placeholder="INVOICE"
        />
        <div>
          <label for="" class="label-unit">Unit Type</label>
          <select name="" id="" class="select-type" v-model="unitType">
            <option value="" disabled>Choose Unit Type</option>
            <option value="QTY">Quantity</option>
            <option value="HOUR">Hour</option>
            <option value="Product">Product</option>
          </select>
        </div>
        <div>
          <label for="" class="label-unit">Currency</label>
          <select name="" id="" class="select-type" v-model="currency">
            <option value="" disabled>Choose your Currency</option>
            <option value="Rs">Ruppes</option>
            <option value="$">Dollar</option>
            <option value="€">Euro</option>
          </select>
        </div>
      </div>
      <form class="invoice-details-form">
        <div>
          <h1 class="heading">From</h1>
          <div class="form-fields">
            <label for="Name">Name</label>
            <input
              type="text"
              name="Name"
              placeholder="Business Name"
              v-model="billFromForm.name"
            />
          </div>
          <div class="form-fields">
            <label for="Email">Email</label>
            <div>
              <input
                type="email"
                name="Email"
                placeholder="name@business.com"
                v-model="billFromForm.email"
                @input="validateEmail"
              />
              <p v-if="billFromForm.emailError" style="color: red">{{ billFromForm.emailError }}</p>
            </div>
          </div>
          <div class="form-fields">
            <label for="Address">Address</label>
            <input
              type="text"
              name="Address"
              placeholder="Street"
              v-model="billFromForm.address"
              @focus="showAddressfield"
            />
          </div>
          <div class="form-fields" v-if="showAddressfields">
            <label for="Address"></label>
            <input type="text" name="Address" placeholder="City" v-model="billFromForm.city" />
          </div>
          <div class="form-fields" v-if="showAddressfields">
            <label for="Address"></label>
            <input
              type="text"
              name="Address"
              placeholder="ZipCode"
              v-model="billFromForm.zipCode"
            />
          </div>
          <div class="form-fields">
            <label for="Phone">Phone</label>
            <div>
              <input
                type="tel"
                name="Phone"
                placeholder="(123) 456 789"
                v-model="billFromForm.phone"
              />
              <p v-if="billFromForm.phoneError" style="color: red">{{ billFromForm.phoneError }}</p>
            </div>
          </div>
          <div class="form-fields">
            <label for="Gst">GST#</label>
            <input type="text" name="Gst" placeholder="123456789 RT" v-model="billFromForm.gst" />
          </div>
        </div>
        <div>
          <h1 class="heading">Bill To</h1>
          <div class="form-fields">
            <label for="Name">Name</label>
            <input type="text" name="Name" placeholder="Client Name" v-model="billToForm.name" />
          </div>
          <div class="form-fields">
            <label for="Email">Email</label>
            <div>
              <input
                type="email"
                name="Email"
                placeholder="name@client.com"
                v-model="billToForm.email"
              />
              <p v-if="billToForm.emailError" style="color: red">{{ billToForm.emailError }}</p>
            </div>
          </div>
          <div class="form-fields">
            <label for="Address">Address</label>
            <input type="text" name="Address" placeholder="Street" v-model="billToForm.address" />
          </div>
          <div class="form-fields">
            <label for="Phone">Phone</label>
            <div>
              <input
                type="tel"
                name="Phone"
                placeholder="(123) 456 789"
                v-model="billToForm.phone"
              />
              <p v-if="billToForm.phoneError" style="color: red">{{ billToForm.phoneError }}</p>
            </div>
          </div>
          <div class="form-fields">
            <label for="Fax">Fax</label>
            <input type="text" name="Fax" placeholder="(123) 456 789" v-model="billToForm.fax" />
          </div>
        </div>
      </form>
      <div class="invoice-submission-details">
        <div class="form-fields">
          <label for="Number">Number</label>
          <input type="text" name="Number" v-model="invoiceNumber" />
        </div>
        <div class="form-fields">
          <label for="Date" class="date">Date</label>
          <input type="date" name="Date" v-model="invoiceDate" />
        </div>
        <div class="form-fields">
          <label for="Terms" class="terms">Terms</label>
          <select name="Terms" v-model="invoiceTerm">
            <option :value="option" v-for="option in invoiceTerms" :key="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="form-fields" v-if="invoiceTerm==='Custom'">
          <label for="Date" class="due-date">Due </label>
          <input type="date" name="Date" v-model="invoiceDueDate" />
        </div>
      </div>
      <table class="invoice-items-table">
        <thead>
          <tr class="table-headings">
            <td class="sub-heading">DESCRIPTION</td>
            <td class="table-heading">RATE</td>
            <td class="table-heading" v-if="unitType!=='Product'" >{{ unitType !== "Product" ? unitType : "" }}</td>
            <td class="table-heading-preview table-data-border">AMOUNT</td>
          </tr>
        </thead>
        <tbody>
          <tr class="table-content" v-for="(item, index) in invoiceItems" :key="index">
            <td>
              <div class="table-item">
                <button class="item-button-del" @click="deleteInvoiceItem(index)">Delete</button>
                <div>
                  <div>
                    <input
                      type="text"
                      class="item-description"
                      placeholder="Item Description"
                      v-model="item.itemDescription"
                    />
                  </div>
                  <div>
                    <textarea
                      name=""
                      cols="20"
                      rows="5"
                      class="additional-details"
                      placeholder="Additional Details"
                      v-model="item.additionalDetails"
                    ></textarea>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <input
                type="number"
                class="rate"
                v-model="item.rate"
                @input="calculateAmount(index)"
                @focus="emptyInputTag(index)"
              />
            </td>
            <td  v-if="unitType!=='Product'">
              <input
                type="number"
                class="quantity"
                v-model="item.quantity"
                @input="calculateAmount(index)"
              />
            </td>
            <td>
              <div class="item-amount">{{ currency }} {{ item.amount }}</div>
            </td>
          </tr>
          <tr>
            <td>
              <button class="item-button-add" @click="addNewInvoiceItem">Add</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="invoice-subtotal">
        <div>
          <div class="invoice-amount-title">Subtotal</div>
          <div>
            {{ currency }}
            {{ subtotal }}
          </div>
        </div>
        <div>
          <div class="invoice-amount-title">
            Discount in %
            <input
              v-model="discount"
              type="number"
              placeholder="Enter discount"
              class="discount"
              :disabled="total === 0"
            />
          </div>
          <div>{{ currency }} -{{ discountAmount.toFixed(2) }}</div>
        </div>
        <div>
          <div class="invoice-amount-title">Total</div>
          <div>{{ currency }}{{ discountedTotal.toFixed(2) }}</div>
        </div>
        <div>
          <div class="invoice-amount-title">Amount Due</div>
          <div>{{ currency }}{{ discountedTotal.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <!-- preview -->
    <div class="preview" ref="preview_container" v-else>
      <div class="preview-billfromform">
        <div class="photo-drop-preview" v-if="preview">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Selected Logo"
            class="logo-img-preview"
          />
        </div>
        <ul>
          <li class="preview-billFromForm-name">{{ billFromForm.name }}</li>
          <li class="preview-field">
            {{ billFromForm.phone }}
          </li>
          <li class="preview-field">{{ billFromForm.address }}</li>
          <li class="preview-field">{{ billFromForm.city }} {{ billFromForm.zipCode }}</li>
          <li class="preview-field">{{ billFromForm.gst }}</li>
          <li class="preview-field">{{ billFromForm.email }}</li>
        </ul>
      </div>
      <hr class="preview-hr" />
      <div class="preview-billFromForm">
        <ul class="preview-bill-to">
          <li class="preview-subtitle">BILL TO</li>
          <li>
            <h2>{{ billToForm.name }}</h2>
          </li>
          <li>{{ billToForm.address }}</li>
          <li>{{ billToForm.phone }}</li>
          <li>{{ billToForm.fax }}</li>
          <li>{{ billToForm.email }}</li>
        </ul>
        <table class="invoice-details">
          <tbody>
            <tr>
              <td class="preview-invoice-title preview-subtitle">Invoice #</td>
              <td class="preview-field">{{ invoiceNumber }}</td>
            </tr>
            <tr>
              <td class="preview-subtitle">DATE</td>
              <td class="preview-field">{{ invoiceDate}}</td>
            </tr>
            <tr>
              <td class="preview-subtitle">DUE</td>
              <td class="preview-field">{{invoiceTerm!=='Custom'?invoiceTerm:invoiceDueDate  }}</td>
            </tr>
            <tr>
              <td class="preview-subtitle">AMOUNT DUE</td>
              <td class="preview-field">{{ discountedTotal.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr class="preview-hr" />
      <table class="invoice-items-table rounded-table">
        <thead>
          <tr class="table-headings">
            <td class="preview-sub-heading">DESCRIPTION</td>
            <td class="table-heading-preview">RATE</td>
            <td class="table-heading-preview" v-if="unitType !== 'Product'">{{ unitType !== "Product" ? unitType : "" }}</td>
            <td class="table-heading-preview table-data-border">AMOUNT</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in invoicedata" :key="index" class="preview-table-data avoidThisRow" :class="index%2===0?'preview-table-data-background':''">
           
            <td class="preview-table-desc-data" >
              <div class="additional-details-wrapper">
                {{ item.itemDescription }}
              </div>
              <div class="additional-details-wrapper">
                {{ item.additionalDetails }}
              </div>
            </td>
            <td class="preview-total-value">{{ currency }}{{ item.rate }}</td>
            <td  class="preview-total-value"  v-if="unitType !== 'Product'">{{ unitType !== "Product" ? item.quantity : "" }}</td>
            <td class="preview-total-value table-data-border">{{ currency }}{{ item.amount }}</td>
          </tr>
        </tbody>
      </table>
      <hr class="preview-hr" />
      <div class="preview-total-amount">
        <div class="preview-amount">
          <div class="preview-total-discount">
          <div class="preview-total-heading">DISCOUNT{{ `(${discount}%)` }}</div>
          <div class="preview-total-value">-{{ currency }} {{ discountAmount.toFixed(2) }}</div>
        </div>
        <div class="preview-total">
          <div class="preview-total-heading">TOTAL</div>
          <div class="preview-total-value">{{ currency }} {{ discountedTotal.toFixed(2) }}</div>
        </div>
        <div class="preview-Due-balance">
          <div class="preview-total-heading">AMOUNT DUE</div>
          <div class="preview-balance-due">
            {{ currency === "$" ? "USD" : currency === "€" ? "EUR" : "INR" }}
            {{ discountedTotal.toFixed(2) }}
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import Html2pdf from "html2pdf.js";
import Currency from "currency.js";
const preview = ref(false);
const preview_container = ref(null);
const invoiceTitle = ref("INVOICE");
const billFromForm = ref({
  name: "",
  email: "",
  address: "",
  phone: "+91",
  gst: "",
  emailError: "",
  phoneError: "",
  city: "",
  zipCode: "",
});
const billToForm = ref({
  name: "",
  email: "",
  address: "",
  phone: "",
  fax: "",
  emailError: "",
  phoneError: "",
});
const invoiceNumber = ref("INV0001");
const currency = ref("");
const date = new Date();
const newdate =new Date();
const invoiceDueDate =ref(
  `${newdate.getFullYear()}-${
    newdate.getMonth() < 10 ? `0${newdate.getMonth()}` : newdate.getMonth()
  }-${newdate.getDate()}`
);
const invoiceDate = ref(
  `${date.getFullYear()}-${
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
  }-${date.getDate()}`
);
const invoiceTerm = ref("Due On Reciept");
const invoiceTerms = ref([
  "None",
  "Custom",
  "Due On Reciept",
  "Next Day",
  "2 Days",
  // ... other terms ...
]);
const unitType = ref("Product");
const invoiceItems = ref([
  {
    itemDescription: "",
    additionalDetails: "",
    quantity: 1,
    rate: 0, 
    amount: 0,
  },
]);
const checkRateandDescription=ref(false)
const invoicedata=ref([''])
const togglePreview = () => {
  console.log('object');
  if (validateEmailAndPhone()) {
    preview.value = !preview.value;
  }
  if(total.value=='0'){
    checkRateandDescription.value=true
  }else{
    checkRateandDescription.value=false
  }
  invoicedata.value=invoiceItems.value.filter((e)=>{
  return  e.itemDescription!==''&&e.rate!==(''||0)
})
};

const showAddressfields = ref(false);
const showAddressfield = () => {
  showAddressfields.value = true;
};
const validateEmailAndPhone = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^(\+\d{2,3})?\d{10}$/;
  if (!emailPattern.test(billFromForm.value.email)) {
    billFromForm.value.emailError = "Invalid email format";
    return false;
  } else {
    billFromForm.value.emailError = "";
  }
  if (!emailPattern.test(billToForm.value.email)) {
    billToForm.value.emailError = "Invalid email format";
    return false;
  } else {
    billToForm.value.emailError = "";
  }
  if (!phonePattern.test(billFromForm.value.phone)) {
    billFromForm.value.phoneError = "Invalid phone number format";
    return false;
  } else {
    billFromForm.value.phoneError = "";
  }
  if(billToForm.value.phone){
    if (!phonePattern.test(billToForm.value.phone)) {
    billToForm.value.phoneError = "Invalid phone number format";
    return false;
  } else {
    billFromForm.value.phoneError = "";
  }
  }else{
    billFromForm.value.phoneError = "";
  }
  return true;
};
const subtotal = computed(() => {
  let totalAmount = 0;
  invoiceItems.value.forEach((item) => {
    totalAmount += item.amount;
  });
  return totalAmount;
});
const total = computed(() => {
  let totalAmount = 0;
  invoiceItems.value.forEach((item) => {
    totalAmount += item.amount;
  });

  return totalAmount;
});
const balanceDue = computed(() => {
  let totalAmount = 0;
  invoiceItems.value.forEach((item) => {
    totalAmount += item.amount;
  });
  return totalAmount;
});

const addNewInvoiceItem = () => {
  invoiceItems.value.push({
    itemDescription: "",
    additionalDetails: "",
    quantity: 1,
    rate: 0,
    amount: 0,
  });
};
const deleteInvoiceItem = (index) => {
  invoiceItems.value.splice(index, 1);
};
const applyDiscount = ref("0");

const discount = ref(0);

const discountAmount = computed(() => {
  if (discount.value > 0) {
    return (discount.value / 100) * total.value;
  }
  return 0;
});

const discountedTotal = computed(() => {
  if (discount.value > 0) {
    return total.value - discountAmount.value;
  }
  return total.value;
});
const calculateAmount = (index) => {
  const invoiceItem = invoiceItems.value[index];
  invoiceItem.amount = invoiceItem.rate * invoiceItem.quantity;
};
const emptyInputTag =(index)=>{
  const invoiceItem = invoiceItems.value[index];
  if (invoiceItem.rate === 0) {
        invoiceItem.rate = '';
      }
}
const conversionRates = {
  Rs: 1,
  $: 0.012,
  "€": 0.011,
};
const convertedAmount = computed(() => {
  return Currency(total.value).multiply(rate);
});
const printAndClose = () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(`
    <style>
    button {
   cursor: pointer;
   color: #fff;
}

.preview-download {
   display: flex;
   justify-content: space-between;
   margin-bottom: 1rem;
gap: 4rem;
position: fixed;
    z-index: 9999;
    min-width: 680px;
    background: white;
    top: 0;
}
.preview_button{
   margin-top: 32px;
   display: flex;
   justify-content: space-between;
   margin-bottom: 1rem;
gap: 4rem;
width: -webkit-fill-available;
}
.preview_button button {
   height: 40px;
   padding: 1rem;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 0.5rem;
   background-color: #337ab7;
   border-color: #2e6da4;
}

.preview-download button:hover{
   background-color: white;
   color: #337ab7;
}
.item-button-del:hover {
   background-color: white;
   color: red;
   border-color: red;
}
.item-button-add:hover{
   background-color: white;
   color: #488a22;
   border-color:#488a22 ;
}
.select-currency-unit{
   margin-top: 10px;
   display: flex;
   justify-content: space-between;
   cursor: pointer;
}
.invoice-container {
   width: 100%;
   margin: 0 auto;
   padding: 2rem;
   box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
       0 4px 6px -4px rgba(0, 0, 0, 0.1);
   border-radius: 1rem;
   color: black;
   min-width: 738px;
   position: relative;
}
.invoice-form{
   margin-top: 100px;
}
.invoice-title-input {
   height: 50px;
   outline: none;
   padding-left: 0.5rem;
   font-size: 24px;
   margin-bottom: 2rem;
   margin-right: 2rem;
   margin-top: 10px;
}

.heading {
   margin-bottom: 1rem;
   color: black;
}

.invoice-details-form {
   display: flex;
   flex-wrap: wrap;
   justify-content: space-between;
   border-bottom: 1px solid grey;
   padding-bottom: 2rem;
   margin-bottom: 1.5rem;
}

.form-fields {
   margin-bottom: 1rem;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.form-fields label {
   margin-right: 1rem;
   font-weight: 500;
   font-size: 17px;
}

.form-fields input,
.form-fields select {
   height: 35px;
   width: 250px;
   padding-left: 0.5rem;
   outline: none;
}
.terms{
   margin-right: 31px !important;
}
.date{
   margin-right: 41px !important;
}
.due-date{
   white-space: nowrap;
   margin-right: 45px !important;
}
.invoice-submission-details {
   min-width: 300px;
   max-width: 320px;
}

.invoice-items-table {
   border-collapse: collapse;
   width: 100%;
   margin-bottom: 1rem;
}

.table-headings {
   padding: 12px;
   color: white;
   font-weight: 600;
   height: 40px;
}
thead{
   background-color: #488a22;
}
@media print {
   thead {
     background-color: #488a22!important;
     -webkit-print-color-adjust: exact !important;
   }
 }
.table-content {
   border-bottom: 2px dotted lightgrey;
}

.table-content td {
   vertical-align: top;
}

.table-item {
   display: flex;
   gap: 1rem;
   margin-bottom: 1rem;
}

.item-description,
.rate,
.quantity {
   height: 30px;
   margin: 0.5rem 0;
   outline: none;
   padding-left: 0.5rem;
}

.additional-details {
   outline: none;
   resize: none;
   padding: 0.5rem;
}
.preview-table-data-background{
background-color: #f1f1f1;
}
.item-button-del {
   height: 30px;
   margin-top: 1rem;
   padding: 0.2rem 1rem;
   background-color: red;
   border-radius: 3px;
   color: #fff;
   font-weight: 600;
}
.item-button-add {
   height: 30px;
   margin-top: 1rem;
   padding: 0.2rem 1rem;
   background-color:#488a22;
   border-radius: 3px;
   color: #fff;
   font-weight: 600;
}
.item-amount {
   margin: 0.5rem;
   text-align: right;
}
.invoice-amount-title{
   font-weight: 600;
}
.invoice-subtotal {
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   margin-right: 2rem;
}

.invoice-subtotal div {
   display: flex;
   gap: 4rem;
}
select ,input,textarea{
   background-color: #f1f1f1;
    border: none;
    box-shadow: 1px 2px 2px 0px lightslategray;
    border-radius: 4px;
}
.preview-billFromForm {
   display: flex;
   justify-content: space-between;
   color: rgb(68, 68, 68);
   font-weight: 400;
   font-size: 14px;
   padding: 10px 0px;
}
.label-unit{
   font-weight: 600;
   font-size: 17px;
}
.preview-total {
   display: flex;
   justify-content: space-between;
   position: right;
   padding: 10px 0px;
   border-bottom: 3px solid #f1f1f1;
   font: 14px;    
}

.preview-Due-balance{
   display: flex;
   justify-content: space-between;
   position: right;
   padding: 10px 0px;
   border-bottom: 3px solid #f1f1f1;
   font: 14px;   
   font-weight: 600; 
   background-color: #f1f1f1;
   border-radius: 2px 5px 2px 5px;
}
.preview-total-discount{
   display: flex;
   justify-content: space-between;
   position: right;
   padding: 10px 0px;
   font: 14px;
   border-bottom: 3px solid #f1f1f1;
}
.preview-billFromForm-name {
   font-size: 20px;
   font-weight: 700;
   color: #555;
   text-align: right;
}

.preview-field-title {
   font-size: 12px;
   font-weight: 600;
   text-transform: uppercase;
   margin-bottom: 8px;
}

.preview-hr {
   margin: 15px 0px;
 color: #f1f1f1;
 border: 2px solid #f1f1f1;
}
.preview {
   margin: 60px 20px;
   color:black;
}
.preview-subtitle{
   font-weight: 700;
}
.invoice-details{
width: 33%;
}
table >tr{
   page-break-inside: avoid;
}
.preview-bill-to {
   margin-bottom: 30px;
   padding: 0;
   color: black;
}
.preview-heading {
   padding: 10px 0px;
   border-bottom: 1px solid;
   border-top: 1px solid;
}
.photo-drop-preview{
   display: flex;
}
.preview-billfromform{
display: flex;
justify-content: space-between;
}
.preview-sub-heading {
   text-align: start;
   font-size: 15px !important;
   font-weight: 600 !important;
   color: white !important;
   padding-left: 8px;
   border-radius: 4px 0px 0px 4px;
}
.sub-heading {
   text-align: center;
   font-size: 15px !important;
   font-weight: 600 !important;
   color: white !important;
   padding-left: 2px;
   border-radius: 4px 0px 0px 4px;
}
.preview-total-amount {
   display: flex;
   flex-direction: column;
   align-items: flex-end;
}
.preview-total-value{
   font-weight: 600;
   padding-right: 4px;
}
.preview-amount{
   width: 50%;
}
.preview-amount-heading {
   display: flex;
}

li {
   list-style: none;
}

.preview-field {
margin-left: 10px;
text-align: right;
}

.preview-item-amount {
   border-bottom: 2px dotted lightgrey;
   margin-bottom: 10px;
}

.preview-balance-due {
   font-size: 16px;
   font-weight: 700;
   color: black;
   white-space: nowrap;
   padding-top: 0px;
   padding-right: 4px;
}

.preview-total-heading {
   color: black;
   font-size: 15px;
   font-weight: 700;
   padding-top: 4px;
   padding-left: 3px;
   margin-right: 10px;
}
th {
   padding: 10px 0px;
   text-align: end;
   font-size: 12px !important;
   font-weight: 700 !important;
   color: white !important;

}
.table-heading{
   font-weight: 600;
   text-align: left;
}
.table-heading-preview{
   font-weight: 600;
   text-align: right;
   padding-right: 8px;
}
.table-data-border{
   border-radius: 0px 4px 4px 0px;
}
.preview-table-data {
   text-align: end;
   border-bottom: 1px solid gray;
}

.preview-table-data td {
   padding: 0.5rem;
   width: 250px;

}

.preview-table-desc-data {
   text-align: justify;
   max-width: 250px;
   padding-right: 10px;
   border-radius: 8px 0px 0px 8px;
}
.additional-details-wrapper {
   white-space: normal;
   word-wrap: break-word;
   max-width: 250px;
}
.preview-table-desc-data div:first-child {
   font-size: 16px;
   font-weight: 700;
   max-width: 250px;
}
.photo-drop {
   margin-top: 10px;
   margin-bottom: 10px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   min-width: 180px;
   min-height: 90px;
   text-align: center;
   background-color: #fff;
   border: 1px solid #aaa;
    border-radius: 3px; 
   padding: 8px 16px;
}
.logo-img{
   width: 150px;
   height: 75px;
   margin: 0 5px;
   vertical-align: middle;
    border-style: none;
    position: absolute;
}
.discount{
   width: 45px;
padding: 0px;
   margin-right: 12px;
   margin-top: 5px;
   border: 1px solid black;
   border-radius: 3px;
}
.discount-filed{
   width: 50px;
}
thead{
   background-color: #488a22;
}
.logo-img-preview{
   width: 150px;
   margin: 10px 5px;
   vertical-align: middle;
    border-style: none;
}
th{
   padding-left:4px ;
   padding-right:4px ;
}
.select-img-symbol-icon{
   width: 25px;
}
.select-img{
display: contents;
}
.add-logo-message{
   height: 20px;
   position: absolute;
bottom: 5px;
background-color: #fff;
width: 100%;
display: none;
}
.select-img-symbol{
   display: flex;
   align-items: center;
   cursor: pointer;
}
.guide-message {
   font-size: 12px;
   font-weight: 500;
}
.photo-drop:hover .add-logo-message ,.remove-logo {
   display: block;
}
.photo-drop:hover .remove-logo {
   display: block;
}
.remove-logo{
   height: 15px;
   position: absolute;
   right: 5px;
   top: 5px;
background-color: #fff;
display: none;
}
.remove-logo-icon{
   font-size: 12px;
   font-weight: 700;
}
.select-type{
   padding: 10px;
}
@media print {
   thead {
     background-color: #488a22!important;
     -webkit-print-color-adjust: exact !important;
   }
   .preview-Due-balance{
   display: flex;
   justify-content: space-between;
   position: right;
   padding: 10px 0px;
   border-bottom: 3px solid #f1f1f1;
   font: 14px;   
   font-weight: 600; 
   background-color: #f1f1f1;
   border-radius: 2px 5px 2px 5px;
   -webkit-print-color-adjust: exact !important;
}
.preview-table-data-background{
background-color: #f1f1f1;
-webkit-print-color-adjust: exact !important;
}
 }
    </style>
  `);
  const printContent =preview_container.value;
  printWindow.document.write(printContent.innerHTML);
  
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.addEventListener('afterprint', () => {
    printWindow.close();
  });

  printWindow.print();
};

const selectedImage = ref(null);
const imageInput = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    imageInput.value.value = null;
  }
};
const removeLogo = () => {
  selectedImage.value = null;
};
</script>

<style scoped>
@import url("../assets/invoice.css");
</style>
