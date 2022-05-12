const getAnagram = (input) => {
  let obj = {}
  input.map((v)=>{
    const pecah = v.split("").sort().join("")
    if(!obj.hasOwnProperty(pecah)){
      obj[pecah]=[v]
    }else{
      obj[pecah].push(v)
    }
  })
  console.log(Object.values(obj))
}

const input = ['kita', 'atik', 'tika', 'aku', 'kia', 'makan', 'kua']
getAnagram(input)