// DADOS DE ENTRADA 
const inputs = {
  entrada: [
    { simbolo: "A", probabilidade: "1/3" },
    { simbolo: "B", probabilidade: "1/3" },
    { simbolo: "C", probabilidade: "1/3" }
  ],
  matrizInicial: [
    ["2/9",   "3/9", "4/9"],
    ["13/15", "0",   "2/15" ],
    ["1/14",  "0",   "13/14" ]
  ],
  saida: [
    "A", "B", "C"
  ]
};

// Funcoes auxiliares
const converterParaDecimal = (fracao) => {
  if (!String(fracao).includes("/")) return Number(fracao);

  const [numerador, denominador] = fracao.split("/");

  return Number(numerador) / Number(denominador);
}

const checarProbabilidadesDeEntrada = () => {
    const probsEntrada = inputs.entrada.reduce((prev, cur) => converterParaDecimal(prev) + converterParaDecimal(cur.probabilidade), 0)

    if (probsEntrada !== 1) {
      return false;
    }
    return true
}

const checarLinhasDaMatriz = () => {
  const somaDasLinhas = Array(inputs.matrizInicial.length);

  inputs.matrizInicial.forEach((linha, i) => {
    const somaLinha = linha.reduce((prev, cur) => converterParaDecimal(prev) + converterParaDecimal(cur),0)
    somaDasLinhas[i] = somaLinha
  })

  const todasAsLinhas = somaDasLinhas.find((item) => item !== 1)

  if (todasAsLinhas !== undefined)
    return false
  
  return true
}

const checarColunasEntradaESaidas = () => {
  let flag = true;

  inputs.matrizInicial.forEach((innerMatrix) => {
    if (innerMatrix.length !== inputs.saida.length) {
      flag = false;
      return;
    }
  });

  return flag;
}

const matrizProbConjunta = () => {
  let mat = Array(inputs.matrizInicial.length)
              .fill(null)
              .map(() => Array(inputs.matrizInicial[0].length).fill(0));

  for (let i = 0; i < inputs.matrizInicial.length ; i++) {
    for (let j = 0; j < inputs.matrizInicial[i].length ; j++) {
      mat[i][j] = converterParaDecimal(inputs.matrizInicial[i][j]) 
                  * converterParaDecimal(inputs.entrada[i].probabilidade);
    }
  }
  return mat;
}

// H(X)
const entropiaDeEntrada = () => {
  const matrizProbs = matrizProbConjunta();
  const probabilidades = Array(matrizProbs.length);

  matrizProbs.forEach((innerMatrix, i) => {
    probabilidades[i] = innerMatrix.reduce((prev, cur) => prev + cur, 0);
  });

  let hDeX = 0;
  probabilidades.forEach((prob, index) => {
    hDeX = hDeX - Math.log2(prob) * prob;
  });

  return Number(hDeX.toFixed(2));
}

// H(Y|X = Entrada)
const entropiaCondicionalYEntrada = () => {
  let matrizCond = inputs.matrizInicial.map(inner => inner.map(converterParaDecimal));
  let hCondicionalEntradas = Array(inputs.matrizInicial.length)
  .fill(0)

  matrizCond.forEach((innerMatrix, i) => {
    innerMatrix.forEach((item, j) => {
      if (item === 0) {
        return
      }

      hCondicionalEntradas[i] = hCondicionalEntradas[i] - Math.log2(item) * item;
    })
  });

  // DEBUG ONLY
  // hCondicionalEntradas.forEach((item, index) => {
  //   console.log(`H(Y|X = ${inputs.entrada[index].simbolo}): ${item.toFixed(2)}`)
  // })

  return hCondicionalEntradas;
}

// H(Y|X)
const entropiaCondicionalY = () => {
  const entropiaDasEntradas = entropiaCondicionalYEntrada()
  let entropiaCond = 0;

  entropiaDasEntradas.forEach((item, index) => {
    entropiaCond += converterParaDecimal(inputs.entrada[index].probabilidade) * item
  })

  return Number(entropiaCond.toFixed(2));
}

// H(X,Y)
const entropiaConjunta = () => {
  const entropiaEntrada = entropiaDeEntrada();
  const entropiaCondSaida = entropiaCondicionalY();
  const entropiaConj = entropiaEntrada + entropiaCondSaida;

  return Number(entropiaConj.toFixed(2));
}


// I(X,Y)
const informacaoMutuaMedia = () => {
  const entropiaEntrada = entropiaDeEntrada()
  const entropiaCond = entropiaCondicionalY()
  const imm = entropiaEntrada - entropiaCond;
  
  return Number(imm.toFixed(2));
}

// H(X|Y)
const equivocacaoDoCanal = () => {
  const entropiaEntrada = entropiaDeEntrada();
  const infoMutuaMedia = informacaoMutuaMedia();
  const eqDoCanal = entropiaEntrada - infoMutuaMedia;

  return Number(eqDoCanal.toFixed(2));
}

if (!checarProbabilidadesDeEntrada()) {
  console.log("A soma das probabilidades de entrada precisa ser igual a 1!");
  return;
}

if (!checarLinhasDaMatriz()) {
  console.log("A soma das linhas da matriz inicial precisa ser igual a 1!")
  return;
}

if(!checarColunasEntradaESaidas()) {
  console.log("O Número de colunas da matriz inicial precisa ser igual ao número de saídas!");
  return;
}

console.log(`H(X): ${entropiaDeEntrada()} sh/símbolo`);
console.log(`H(Y|X): ${entropiaCondicionalY()} sh/símbolo`);
console.log(`H(X,Y): ${entropiaConjunta()} sh/símbolo`)
console.log(`I(X,Y): ${informacaoMutuaMedia()} sh`);
console.log(`H(X|Y): ${equivocacaoDoCanal()} sh/símbolo`)