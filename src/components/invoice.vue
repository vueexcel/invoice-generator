<template>
    <div class="invoice-container">
      <div class="preview-download">
        <div class="preview_button">
          <div>
            <button @click="togglePreview">
          {{ preview ? "Edit" : "Preview" }}
        </button>
        <p v-if="checkRateandDescription" style="color: red">Please filled the Description </p>
          </div>
          <button   v-if="preview" @click="test">Download PDF</button>
          <div class="">
          <button @click="sendEmail"  v-if="preview">Send Email</button>
        <span v-if="sendEmailResponse" style="color: green">Email sent successfully</span>
        </div>
        </div>
        <div class="photo-drop aspect-ratio-16x9" v-if="!preview">
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
              <label for="Subject">Subject</label>
              <input type="text" name="Subject"  v-model="billToForm.Subject" />
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
                <td class="preview-field"> {{currency}} {{ discountedTotal.toFixed(2) }}</td>
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
import axios from 'axios';
const preview = ref(false);
const preview_container = ref(null);
const invoiceTitle = ref("INVOICE");
const billFromForm = ref({
  name: "",
  email: "aqws@ss2.ss",
  address: "",
  phone: "+911234567890",
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
  Subject: "",
  emailError: "",
  phoneError: "",
});
const invoiceNumber = ref("INV0001");
const currency = ref("Rs");
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
  if (validateEmailAndPhone()&&invoiceItems.value[0].itemDescription!=='') {
    preview.value = !preview.value;
    billFromForm.value.phoneError=false
    billFromForm.value.emailError=false
    billToForm.value.phoneError=false
  }
  if(invoiceItems.value[0].itemDescription==''){
    checkRateandDescription.value=true
  }else{
    checkRateandDescription.value=false
  }
  invoicedata.value=invoiceItems.value.filter((e)=>{
  return  e.itemDescription!==''&&e.rate!==(''&& 0)

})
sendEmailResponse.value=false
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
const storedPdfDataUri=ref('')
const removeLogo = () => {
  selectedImage.value = null;
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
function test() {
    const preview = preview_container.value;
  Html2pdf().from(preview).set({
    margin: 10,
    filename: `${invoiceTitle.value ? `${invoiceTitle.value}.pdf` : "invoice.pdf"}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak:  { mode: 'specify', avoid:'.avoidThisRow' } ,
  }).save();
}
const recipient = ref('');
  const message = ref('');
  const attachment = ref(null);
  const sendEmailResponse=ref(false)
const sendEmail = async () => {
  const preview = preview_container.value;
  const pdfOptions = {
    margin: 10,
    filename: `${invoiceTitle.value ? `${invoiceTitle.value}.pdf` : "invoice.pdf"}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: 'specify', avoid: '.avoidThisRow' }
  };
  try {
    const pdfDataUri = await Html2pdf().from(preview).set(pdfOptions).toPdf().output('datauristring');
    const pdfBlob = dataURItoBlob(pdfDataUri);
    const formData = new FormData();
    formData.append('to', billToForm.value.email);
    formData.append('message', billToForm.value.Subject);
    formData.append('from', billFromForm.value.email);
    formData.append('attachment', pdfBlob, 'attachment.pdf'); // Use the proper filename here
    const response = await axios.post('https://unmiraculous-capaci.000webhostapp.com/api/send-email', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    sendEmailResponse.value=true
    console.log(response.data.message);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to convert data URI to Blob
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

</script>

<style scoped>
@import url("../assets/invoice.css");
</style>