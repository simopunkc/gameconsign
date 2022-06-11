const getDiamond = (input) => {
  let col = (input * 2) - 1
  const indexInput = input - 1
  let start = indexInput, finish = indexInput, temp = ""
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < col; j++) {
      temp += (j >= start && j <= finish) ? "-" : "+"
    }
    if (i < indexInput) {
      start -= 1
      finish += 1
    } else {
      start += 1
      finish -= 1
    }
    console.log(temp)
    temp = ""
  }
}

getDiamond(9)