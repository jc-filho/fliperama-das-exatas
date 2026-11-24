/* tutoriais.js — conteúdo dos tutoriais e guias "Como resolver" de cada jogo.
   Cada jogo tem uma lista de passos: t = título do passo, h = texto (HTML).
   A classe "f" destaca uma fórmula; "f ex" destaca um exemplo resolvido. */
const TUTORIAIS={

cubo:{titulo:'Cubo Mágico: Speedrun',passos:[
 {t:'Objetivo',h:`<p>Deixar cada uma das 6 faces com <b>uma cor só</b>. Clique em <b>Embaralhar</b> e tente resolver. O cronômetro começa no seu primeiro giro e para quando o cubo fica resolvido.</p>
  <p>Arraste a tela para girar a câmera e ver o cubo de outros lados (isso não mexe nas peças).</p>`},
 {t:'Controles',h:`<ul><li><b>U D R L F B</b> giram uma face: Cima, Baixo, Direita, Esquerda, Frente e Trás, no sentido <b>horário</b> (olhando de frente para aquela face).</li>
  <li>Com <b>′</b> (ou Shift no teclado) o giro é <b>anti-horário</b>.</li>
  <li><b>x, y, z</b> viram o <b>cubo inteiro</b>: x vira para cima (como R), y vira para a esquerda (como U), z tomba para a direita (como F).</li>
  <li><b>Desfazer</b> volta o último giro. <b>Resolver</b> desfaz tudo o que foi feito.</li></ul>`},
 {t:'A matemática por trás',h:`<p>Cada peça tem uma posição, que é um vetor p = (x, y, z), e girar uma face é multiplicar esse vetor por uma <b>matriz de rotação</b> de 90°:</p>
  <span class="f">p′ = R · p</span>
  <p>Por exemplo, R (face direita) é a rotação de −90° em torno do eixo x. Virar o cubo inteiro (x, y, z) é aplicar a mesma matriz às 26 peças. Desfazer usa a matriz inversa, que é a transposta: R⁻¹ = Rᵀ.</p>`},
 {t:'Método de camadas (1/3): face branca',h:`<p>Com o <b>branco em cima</b>, como o cubo começa:</p>
  <ol><li><b>Cruz branca:</b> leve as 4 arestas brancas para cima, formando uma cruz. A outra cor de cada aresta deve combinar com o centro da lateral (intuitivo, sem fórmula).</li>
  <li><b>Cantos brancos:</b> encontre um canto com branco na camada de baixo e gire D até ele ficar <b>embaixo do lugar dele</b>, na posição frente-direita. Repita</li></ol>
  <span class="f">R′ D′ R D</span>
  <p>até o canto subir certinho (pode levar 1, 3 ou 5 repetições). Gire o cubo com <b>y</b> para trabalhar o próximo canto.</p>`},
 {t:'Método de camadas (2/3): segunda camada',h:`<p>Vire o cubo de cabeça para baixo com <b>x x</b> (x duas vezes): o branco vai para baixo e o amarelo para cima.</p>
  <p>Procure em cima uma aresta <b>sem amarelo</b>. Gire U até a cor da frente dela combinar com o centro da frente. Ela precisa descer para a direita ou para a esquerda:</p>
  <span class="f">Para a direita: U R U′ R′ U′ F′ U F<br>Para a esquerda: U′ L′ U L U F U′ F′</span>`},
 {t:'Método de camadas (3/3): face amarela',h:`<ol><li><b>Cruz amarela:</b> repita <span class="f">F R U R′ U′ F′</span> até aparecer a cruz em cima. Se houver um "L" amarelo, deixe-o no canto de trás-esquerda antes; se houver uma linha, deixe-a na horizontal.</li>
  <li><b>Arestas no lugar:</b> <span class="f">R U R′ U R U U R′</span> troca arestas de cima até combinarem com os centros.</li>
  <li><b>Cantos no lugar:</b> <span class="f">U R U′ L′ U R′ U′ L</span> roda 3 cantos; repita até todos estarem na posição certa (mesmo que virados).</li>
  <li><b>Cantos virados:</b> com um canto errado na frente-direita de cima, repita <b>R′ D′ R D</b> até o amarelo ficar em cima. Depois gire só <b>U</b> para trazer o próximo canto e repita. No fim, ajuste U.</li></ol>
  <p>Durante o passo 4 o cubo parece bagunçar: é normal, ele volta no final.</p>`},
]},

funcoes:{titulo:'Caça-Estrelas',passos:[
 {t:'Objetivo',h:`<p>Cada fase mostra <b>estrelas</b> no plano e uma função com parâmetros (a, b, c…). Ajuste os parâmetros até o gráfico <b>passar por todas as estrelas</b>. Cada estrela tocada acende.</p>
  <p>São 8 fases: afim, modular, quadrática, exponencial e seno. O tempo conta, e cada <b>Dica</b> soma 15 s.</p>`},
 {t:'Controles',h:`<ul><li>Cada parâmetro tem um <b>controle deslizante</b>; o gráfico muda na hora.</li>
  <li>Cada estrela mostra suas <b>coordenadas (x; y)</b>: use-as para calcular.</li>
  <li><b>Dica</b> acerta um parâmetro para você. <b>Como calcular</b> mostra a ideia de cada fase.</li></ul>`},
 {t:'Exemplo: função afim f(x) = ax + b',h:`<p>A reta passa por dois pontos. Com as estrelas (−2; −7) e (5; 7):</p>
  <span class="f ex">a = (y₂ − y₁)/(x₂ − x₁) = (7 − (−7))/(5 − (−2)) = 14/7 = <b>2</b><br>b = y₁ − a·x₁ = −7 − 2·(−2) = <b>−3</b><br>f(x) = 2x − 3 ✓ (confira: f(5) = 10 − 3 = 7)</span>
  <p>Coloque a = 2 e b = −3 nos controles.</p>`},
 {t:'Modular e quadrática',h:`<p><b>Modular</b> f(x) = a·|x − h| + k: o "bico" do V fica em <b>(h; k)</b> e a inclinação dos lados é a e −a. Ache o bico e meça quanto sobe a cada passo.</p>
  <p><b>Quadrática</b> f(x) = ax² + bx + c:</p>
  <span class="f">c = f(0) (onde a parábola corta o eixo y)<br>vértice em x = −b/(2a)</span>
  <p>Com 3 estrelas, substitua cada uma em f(x) e resolva o sistema. Dica: comece pelo sinal de a (para cima ou para baixo).</p>`},
 {t:'Exponencial e seno',h:`<p><b>Exponencial</b> f(x) = a·bˣ + c: a curva encosta na reta <b>y = c</b> (assíntota).</p>
  <span class="f">f(0) = a + c  e  f(1) = a·b + c ⇒ b = (f(1) − c)/a</span>
  <p><b>Seno</b> f(x) = a·sen(bx) + c:</p>
  <span class="f">c = (máximo + mínimo)/2   |a| = (máximo − mínimo)/2<br>período = 2π/b</span>
  <p>Ache primeiro a linha do meio (c), depois a altura da onda (a), e por último ajuste b até as ondas baterem.</p>`},
]},

ponte:{titulo:'Ponte sobre a Lava',passos:[
 {t:'Objetivo',h:`<p>A ponte é o <b>gráfico de f</b>. Em x = a ela quebrou porque <b>f(a) não existe</b>. Coloque a tábua na altura certa para o explorador atravessar sem cair na lava.</p>
  <p>Se não existe altura que ligue os dois lados, aperte <b>Não tem conserto</b>. São 8 pontes e você tem 3 vidas.</p>`},
 {t:'A ideia: limite e continuidade',h:`<p>A altura certa da tábua é o <b>limite</b> de f(x) quando x se aproxima de a:</p>
  <span class="f">tábua = lim f(x), com x → a</span>
  <p>Colocando a tábua exatamente ali, a função fica <b>contínua</b>: o gráfico passa a não ter buraco.</p>`},
 {t:'Exemplo resolvido',h:`<p>f(x) = (x² − 4)/(x − 2), com a = 2. Substituindo direto dá 0/0 (indeterminação). Então fatore:</p>
  <span class="f ex">(x² − 4)/(x − 2) = (x − 2)(x + 2)/(x − 2) = x + 2<br>quando x → 2: x + 2 → <b>4</b></span>
  <p>Coloque a tábua em <b>4</b> e mande atravessar.</p>`},
 {t:'Truques para cada tipo',h:`<ul><li><b>Polinômios em cima e embaixo:</b> fatore e cancele o fator que zera.</li>
  <li><b>Raiz quadrada:</b> multiplique pelo conjugado. Ex.: (√x − 1)/(x − 1) = 1/(√x + 1) → 1/2.</li>
  <li><b>Limites fundamentais:</b> sen(x)/x → 1 e (eˣ − 1)/x → 1 quando x → 0.</li>
  <li><b>Cubo:</b> x³ − 8 = (x − 2)(x² + 2x + 4).</li></ul>`},
 {t:'Quando não tem conserto',h:`<p>Teste um número um pouco menor e um pouco maior que a (por exemplo a − 0,01 e a + 0,01):</p>
  <ul><li>Se os lados vão para <b>valores diferentes</b> (salto), não existe tábua que ligue os dois. Ex.: |x|/x vale −1 à esquerda e 1 à direita.</li>
  <li>Se a função vai para <b>±∞</b> (assíntota), também não existe altura finita. Ex.: 1/(x − 1)².</li></ul>
  <p>Nos dois casos, aperte <b>Não tem conserto</b>.</p>`},
]},

nave:{titulo:'Nave da Assíntota',passos:[
 {t:'Objetivo',h:`<p>Pilote a nave dentro do <b>túnel</b>, que segue o gráfico de f. Dentro dele você ganha pontos; fora, o escudo cai. O radar só mostra o túnel um pouco à frente.</p>
  <p>Perto da <b>assíntota vertical</b> a nave para e você responde para onde f(x) vai. No fim do setor, responde para onde f vai quando x → +∞.</p>`},
 {t:'Controles',h:`<ul><li>Mova o <b>mouse</b> (ou o dedo) para cima e para baixo sobre a tela: a nave segue.</li>
  <li>Ou segure <b>↑</b> e <b>↓</b> no teclado.</li>
  <li>Resposta certa: +20 pontos. Errada: −20% de escudo.</li></ul>`},
 {t:'Assíntota vertical: + ou −∞?',h:`<p>Ela aparece onde o <b>denominador zera</b> (e o numerador não). Para saber o sinal, teste um x um pouco antes e um pouco depois:</p>
  <span class="f ex">f(x) = 1/(x − 3) + 1, assíntota em x = 3<br>x = 2,9: 1/(−0,1) + 1 = −9 ⇒ pela esquerda <b>−∞</b><br>x = 3,1: 1/(0,1) + 1 = 11 ⇒ pela direita <b>+∞</b></span>
  <p>Atenção: com (x − 2)² no denominador, o quadrado é sempre positivo, então os <b>dois lados têm o mesmo sinal</b>.</p>`},
 {t:'Assíntota horizontal: x → +∞',h:`<p>Para x muito grande, termos como 1/x e 4/x² vão para <b>0</b>. Em frações com polinômios do mesmo grau, o limite é a razão dos coeficientes de maior grau:</p>
  <span class="f ex">2x/(x − 5) → 2/1 = <b>2</b><br>1/(x − 3) + 1 → 0 + 1 = <b>1</b><br>3 − 4/(x − 2)² → 3 − 0 = <b>3</b></span>`},
]},

catapulta:{titulo:'Cerco das Derivadas',passos:[
 {t:'Objetivo',h:`<p>Acerte a <b>gosma</b> com a bola de fogo, passando por cima das muralhas. São 6 fases; acertar no 1º tiro vale ★★★.</p>
  <p>Você controla o <b>ângulo θ</b> e a <b>força v</b> (sliders ou ← → ↑ ↓) e lança com o botão ou Espaço. A mira amarela mostra o começo do voo.</p>`},
 {t:'A trajetória é uma parábola',h:`<p>Sem resistência do ar, a bola faz:</p>
  <span class="f">y(x) = A·x − B·x²<br>A = tg θ   B = g / (2v²·cos²θ),  g = 9,8 m/s²</span>
  <p>O painel mostra A e B para o ângulo e a força escolhidos.</p>`},
 {t:'A derivada dá o topo e o alcance',h:`<p>A derivada é a inclinação do voo em cada ponto (a seta azul):</p>
  <span class="f">y′(x) = A − 2B·x</span>
  <p>No <b>topo</b>, a bola para de subir: y′ = 0.</p>
  <span class="f">topo: x = A/(2B)   altura = A²/(4B)<br>volta ao chão (y = 0): x = A/B</span>`},
 {t:'Exemplo: fase 1 (alvo a 20 m)',h:`<p>Use θ = 45°, então A = tg 45° = 1 e cos²45° = 0,5:</p>
  <span class="f ex">B = 9,8/(2·v²·0,5) = 9,8/v²<br>alcance = A/B = v²/9,8 = 20 ⇒ v² = 196 ⇒ v = <b>14 m/s</b></span>
  <p>Coloque 45° e 14 m/s e lance: acerto de primeira.</p>`},
 {t:'Muralhas e torres',h:`<ul><li><b>Muralha de altura h na posição m:</b> a bola precisa ter y(m) &gt; h. Um ângulo maior deixa o voo mais alto (o topo sobe); depois ajuste a força para manter o alcance.</li>
  <li><b>Alvo numa torre de altura p:</b> a bola precisa chegar ao alvo com y entre p e p + 2, e não só no chão.</li>
  <li>Use <b>Mostrar cálculos</b> para conferir topo e alcance (custa 1 estrela).</li></ul>`},
]},

skatista:{titulo:'Skate Neon',passos:[
 {t:'Objetivo',h:`<p>O skatista desce sozinho pela pista, que é o <b>gráfico de f</b>. Aperte <b>MANOBRA</b> (ou Espaço) bem nos <b>topos</b> e <b>fundos</b> das ondas. São 4 pistas.</p>
  <p>Quanto mais perto do ponto certo, mais pontos: PERFEITO +10, BOM +6, OK +2. Acertos seguidos aumentam o combo.</p>`},
 {t:'A matemática: f′(x) = 0',h:`<p>Nos topos (máximos) e fundos (mínimos), a pista fica <b>reta na horizontal</b>: a reta tangente tem inclinação zero.</p>
  <span class="f">f′(x) = 0 nos máximos e mínimos</span>
  <p>Na pista 1 o <b>medidor</b> embaixo mostra f′(x): aperte quando a curva azul cruzar o zero. Nas outras ele fica desligado, e você precisa calcular.</p>`},
 {t:'Exemplo: pista 2',h:`<p>f(x) = 0,1x³ − 1,2x. Derive e iguale a zero:</p>
  <span class="f ex">f′(x) = 0,3x² − 1,2 = 0<br>x² = 4 ⇒ <b>x = −2</b> e <b>x = 2</b></span>
  <p>Olhe o eixo x e aperte quando o skatista passar por −2 (topo) e por 2 (fundo).</p>`},
 {t:'Outras pistas',h:`<ul><li><b>2·sen(x):</b> f′ = 2·cos(x) = 0 em x = π/2 ≈ 1,57; 3π/2 ≈ 4,71; 7,85; 10,99.</li>
  <li><b>sen(x) + 0,5·sen(2x)</b> e <b>1,5·cos(0,8x) + 0,3x:</b> a conta é mais difícil; observe a <b>prancha</b>. Ela fica na horizontal exatamente onde f′ = 0.</li></ul>
  <p>Dica: aperte um tiquinho antes do ponto, por causa do tempo de reação.</p>`},
]},

tanque:{titulo:'Poção Exata',passos:[
 {t:'Objetivo',h:`<p>A torneira mágica solta poção com vazão <b>f(t)</b> mL por segundo. O frasco está <b>coberto</b>, então você não vê o nível. Feche a torneira quando o frasco estiver <b>exatamente cheio</b>. São 5 poções.</p>`},
 {t:'Controles',h:`<ul><li><b>Abrir torneira</b> começa a encher e o relógio corre em <b>tempo real</b>.</li>
  <li><b>FECHAR</b> (ou Espaço) para a torneira.</li>
  <li>O traço branco no gráfico mostra o tempo atual. A área amarela é a poção que já entrou.</li></ul>`},
 {t:'A matemática: volume é área',h:`<p>O volume que entrou do instante 0 até T é a <b>integral da vazão</b>, que é a área sob o gráfico:</p>
  <span class="f">V(T) = ∫₀ᵀ f(t) dt</span>
  <p>Iguale à capacidade e resolva para T <b>antes</b> de abrir a torneira.</p>`},
 {t:'Exemplo resolvido',h:`<p>Poção de Mana: f(t) = 2t e capacidade 36 mL.</p>
  <span class="f ex">∫₀ᵀ 2t dt = [t²]₀ᵀ = T²<br>T² = 36 ⇒ T = <b>6 s</b></span>
  <p>Abra a torneira e feche quando o relógio marcar 6 s.</p>`},
 {t:'Atalhos geométricos',h:`<ul><li><b>Vazão constante</b> (f = 3): a área é um retângulo, V = 3·T.</li>
  <li><b>Vazão em reta</b> (f = 1 + t ou 10 − t): a área é um trapézio, ou use a primitiva.</li>
  <li><b>f(t) = t²/4:</b> primitiva t³/12.</li></ul>
  <p>Dica: feche cerca de 0,2 s antes, por causa do tempo de reação.</p>`},
]},

corrida:{titulo:'Kart das Áreas',passos:[
 {t:'Objetivo',h:`<p>Três karts correram por 10 segundos. Você vê o <b>gráfico da velocidade</b> v(t) de cada um. Aposte em quem foi <b>mais longe</b> e assista à corrida. São 8 corridas.</p>`},
 {t:'A matemática: distância é área',h:`<p>A distância percorrida é a <b>integral da velocidade</b>, ou seja, a área sob o gráfico:</p>
  <span class="f">d = ∫₀¹⁰ v(t) dt</span>
  <p>Atenção: <b>o pico mais alto nem sempre vence</b>. Um kart rápido só por um instante pode andar menos que um kart médio e constante.</p>`},
 {t:'Áreas de cada estilo',h:`<ul><li><b>Constante c:</b> retângulo, d = 10·c.</li>
  <li><b>Acelera (a·t) ou freia:</b> triângulo, d = (base × altura)/2 = 10 × (velocidade máxima)/2.</li>
  <li><b>Sobe e desce h·sen(πt/10):</b> d = (20/π)·h ≈ 6,4·h.</li>
  <li><b>Arranca tarde k·t²:</b> d = 1000k/3 ≈ 333·k.</li>
  <li><b>Turbo no meio (pico h):</b> d ≈ 2,5·h.</li></ul>`},
 {t:'Exemplo resolvido',h:`<span class="f ex">Kart A: constante 6 m/s ⇒ 10 × 6 = <b>60 m</b><br>Kart B: turbo com pico de 14 m/s ⇒ 2,5 × 14 ≈ <b>35 m</b><br>Kart C: sobe e desce até 9 m/s ⇒ 6,4 × 9 ≈ <b>57 m</b></span>
  <p>O kart A vence, mesmo com o menor pico. Quando não souber a fórmula, compare as áreas no olho: imagine um retângulo com a mesma área.</p>`},
]},
};
