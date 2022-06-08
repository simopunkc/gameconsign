const getDiamond = (input) => {
  let col = (input * 2) - 1
  let start, finish, temp = ""
  for (let i = 0; i < col; i++) {
    if (i <= input - 1) {
      start = (input - 1) - i
      finish = (input - 1) + i
    } else {
      start = (i - input) + 1
      finish = (col - start) - 1
    }
    for (let j = 0; j < col; j++) {
      temp += (j >= start && j <= finish) ? "-" : "+"
    }
    console.log(temp)
    temp = ""
  }
}

getDiamond(3)