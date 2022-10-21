//Hamming encoder
//Function to generate Hamming code
const generateHammingCode = (inputBits, m, r) => {
  // Stores the Hamming Code of size r + m and initialize it with 0
  let hammingCode = new Array(r + m).fill(0);

  // Find positions of redundant bits
  for (let i = 0; i < r; ++i) {
    /* Placing -1 at redundant bits
     place to identify it later */
    hammingCode[Math.pow(2, i) - 1] = -1;
  }

  let j = 0;
  // Iterate to update the code
  for (let i = 0; i < r + m; i++) {
    /*   Placing inputBits where -1 is
         absent i.e., except redundant
         bits all positions are inputBits */
    if (hammingCode[i] != -1) {
      hammingCode[i] = inputBits[j];
      j++;
    }
  }

  for (let i = 0; i < r + m; i++) {
    /* If current bit is not redundant
     bit then continue */
    if (hammingCode[i] != -1) continue;

    let x = Math.log2(i + 1);
    let oneCount = 0;

    /* Find input Bits containing
         set bit at x'th position */
    for (let j = i + 2; j <= r + m; ++j) {
      if (j & (1 << x)) {
        if (hammingCode[j - 1] == 1) {
          oneCount++;
        }
      }
    }

    /* Generating hamming code for
         even parity */
    if (oneCount % 2 == 0) {
      hammingCode[i] = 0;
    } else {
      hammingCode[i] = 1;
    }
  }

  // Return the generated code
  return hammingCode;
};

/* Function to find the hamming code
   of the given message bit inputBits[] */

const findHammingCode = (inputBits) => {
  // Find the length of inputBits
  let m = inputBits.length;

  // r is the number of redundant bits
  let r = 1;

  // Find the number of redundant bits
  while (Math.pow(2, r) < m + r + 1) {
    r++;
  }

  // Generate code
  let hammingCode = generateHammingCode(inputBits, m, r);

  return hammingCode;
};

//Hamming decoder

const calcRedundantBits = (m) => {
  /* Use the formula 2 ^ r >= m + r + 1
   to calculate the no of redundant bits.
   Iterate over 0 .. m and return the value
   that satisfies the equation */

  for (let i = 0; i < m; i++) {
    if (2 ** i >= m + i + 1) {
      return i;
    }
  }
};

const posRedundantBits = (data, r) => {
  /* Redundancy bits are placed at the positions
   which correspond to the power of 2. */

  let j = 0;
  let k = 1;
  let m = data.length;
  let res = "";

  /* If position is power of 2 then insert '0'
    Else append the data */

  for (let i = 1; i < m + r + 1; i++) {
    if (i == 2 ** j) {
      res = res + "0";
      j += 1;
    } else {
      res = res + data[(data.length - k) % data.length];
      k += 1;
    }
  }
  /* The result is reversed since positions are
   counted backwards. (m + r+1 ... 1) */
  return res.split("").reverse().join("");
};

const calcParityBits = (arr, r) => {
  let n = arr.length;
  /* For finding rth parity bit, iterate over
     0 to r - 1 */
  for (let i = 0; i < r; i++) {
    let val = 0;
    for (let j = 1; j < n + 1; j++) {
      /* If position has 1 in ith significant
            position then Bitwise OR the array value
             to find parity bit value. */
      if ((j & (2 ** i)) == 2 ** i) {
        val = val ^ parseInt(arr[(arr.length - j) % arr.length]);
      }
    }
    /* String Concatenation
      (0 to n - 2^r) + parity bit + (n - 2^r + 1 to n) */
    arr = arr.substring(0, n - 2 ** i) + val + arr.substring(n - 2 ** i + 1);
  }
  return arr;
};

const detectError = (arr, nr) => {
  let n = arr.length;
  let res = 0;

  // Calculate parity bits again
  for (let i = 0; i < nr; i++) {
    let val = 0;
    for (let j = 1; j < n + 1; j++) {
      if ((j & (2 ** i)) == 2 ** i) {
        val = val ^ parseInt(arr[(arr.length - j) % arr.length]);
      }
      /* Create a binary no by appending
           parity bits together. */
    }
    res = res + val * 10 ** i;
    // Convert binary to decimal
  }
  return parseInt(String(res), 2);
};

//adding event listener to the encode button to display the hamming code and inputBits
let encodeButton = document.querySelector(".btn-submit");
const checkForOne = (resultBits) => {
  let count = 0;
  for (let i = 0; i < resultBits.length; i++) {
    if (resultBits[i] == 1) {
      count++;
    }
  }
  return count;
};
encodeButton.addEventListener("click", (e) => {
  e.preventDefault();
  let inputBits = document.querySelector(".input-area").value;
  if (inputBits.length < 4) {
    alert("Please enter at least 4 bits!");
    return;
  }

  inputBits = inputBits.split("");
  inputBits = inputBits.map((item) => parseInt(item));
  let inputBitsResult = document.querySelector(".inputBits-result");
  let hammingCodeResult = document.querySelector(".hammingCode-result");
  let hammingCodeResultEven = document.querySelector(
    ".hammingCode-evenBitsResult"
  );
  let result = findHammingCode(inputBits);
  if (checkForOne(result) % 2 == 0) {
    hammingCodeResultEven.innerHTML = "0" + result.join("");
  } else {
    hammingCodeResultEven.innerHTML = "1" + result.join("");
  }
  inputBitsResult.innerHTML = inputBits.join("");
  hammingCodeResult.innerHTML = result.join("");
  document.querySelector(".input-area").value = "";
});
//adding event listener to the encode button to check for error and decode
let decodeButton = document.querySelector(".btn-submit2");
decodeButton.addEventListener("click", (e) => {
  e.preventDefault();
  let inputBits = document.querySelector(".input-area2").value;
  if (inputBits.length < 7) {
    alert("Please enter at least 7 bits!");
    return;
  }
  let m = inputBits.length;
  let r = calcRedundantBits(m);
  let inputBitsResult = document.querySelector(".inputBits-result2");
  let errorPosition = document.querySelector(".error-position");
  inputBitsResult.innerHTML = inputBits;
  let result = detectError(inputBits, r);
  if (result == 0) {
    errorPosition.innerHTML = "No error found";
  } else {
    errorPosition.innerHTML =
      "Error at position " + String(m - result + 1) + " from the left";
  }
});
