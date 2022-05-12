const getDiamond = (input) => {
  let col = 0
  for(let i=1;i<=input;i++){
    col += (i==1) ? 1 : 2
  }
  const center = Math.ceil(col/2)
  let start, finish, temp="", curr=0
  for(let i=1;i<=col;i++){
    start = center-curr
    finish = center+curr
    curr = (i<center) ? curr+1 : curr-1
    for(let j=1;j<=col;j++){
      temp += (j>=start && j<=finish) ? "-" : "+"
    }
    console.log(temp)
    temp=""
  }
}

getDiamond(3)