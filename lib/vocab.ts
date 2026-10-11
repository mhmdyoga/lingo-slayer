export type Category = "animals" | "things" | "body" | "people";

export type VocabItem = {
  en: string;
  id: string;
  emoji: string;
  cat: Category;
};

// Satu emoji = satu kata, supaya soal gambar tidak ambigu.
export const VOCAB: VocabItem[] = [
  // Hewan
  { en: "cat", id: "kucing", emoji: "🐱", cat: "animals" },
  { en: "dog", id: "anjing", emoji: "🐶", cat: "animals" },
  { en: "bird", id: "burung", emoji: "🐦", cat: "animals" },
  { en: "fish", id: "ikan", emoji: "🐟", cat: "animals" },
  { en: "cow", id: "sapi", emoji: "🐮", cat: "animals" },
  { en: "duck", id: "bebek", emoji: "🦆", cat: "animals" },
  { en: "rabbit", id: "kelinci", emoji: "🐰", cat: "animals" },
  { en: "elephant", id: "gajah", emoji: "🐘", cat: "animals" },
  { en: "monkey", id: "monyet", emoji: "🐵", cat: "animals" },
  { en: "horse", id: "kuda", emoji: "🐴", cat: "animals" },
  { en: "lion", id: "singa", emoji: "🦁", cat: "animals" },
  { en: "frog", id: "katak", emoji: "🐸", cat: "animals" },
  { en: "chicken", id: "ayam", emoji: "🐔", cat: "animals" },
  { en: "turtle", id: "kura-kura", emoji: "🐢", cat: "animals" },
  { en: "bee", id: "lebah", emoji: "🐝", cat: "animals" },
  { en: "butterfly", id: "kupu-kupu", emoji: "🦋", cat: "animals" },
  { en: "snake", id: "ular", emoji: "🐍", cat: "animals" },

  // Benda sekitar
  { en: "book", id: "buku", emoji: "📖", cat: "things" },
  { en: "pencil", id: "pensil", emoji: "✏️", cat: "things" },
  { en: "bag", id: "tas", emoji: "🎒", cat: "things" },
  { en: "chair", id: "kursi", emoji: "🪑", cat: "things" },
  { en: "clock", id: "jam", emoji: "⏰", cat: "things" },
  { en: "ball", id: "bola", emoji: "⚽", cat: "things" },
  { en: "umbrella", id: "payung", emoji: "☂️", cat: "things" },
  { en: "key", id: "kunci", emoji: "🔑", cat: "things" },
  { en: "door", id: "pintu", emoji: "🚪", cat: "things" },
  { en: "bed", id: "tempat tidur", emoji: "🛏️", cat: "things" },
  { en: "phone", id: "telepon", emoji: "📱", cat: "things" },
  { en: "car", id: "mobil", emoji: "🚗", cat: "things" },
  { en: "bicycle", id: "sepeda", emoji: "🚲", cat: "things" },
  { en: "house", id: "rumah", emoji: "🏠", cat: "things" },
  { en: "tree", id: "pohon", emoji: "🌳", cat: "things" },
  { en: "flower", id: "bunga", emoji: "🌸", cat: "things" },
  { en: "sun", id: "matahari", emoji: "☀️", cat: "things" },
  { en: "moon", id: "bulan", emoji: "🌙", cat: "things" },
  { en: "star", id: "bintang", emoji: "⭐", cat: "things" },
  { en: "apple", id: "apel", emoji: "🍎", cat: "things" },
  { en: "banana", id: "pisang", emoji: "🍌", cat: "things" },
  { en: "milk", id: "susu", emoji: "🥛", cat: "things" },
  { en: "bread", id: "roti", emoji: "🍞", cat: "things" },
  { en: "egg", id: "telur", emoji: "🥚", cat: "things" },

  // Anggota tubuh
  { en: "eye", id: "mata", emoji: "👁️", cat: "body" },
  { en: "ear", id: "telinga", emoji: "👂", cat: "body" },
  { en: "nose", id: "hidung", emoji: "👃", cat: "body" },
  { en: "mouth", id: "mulut", emoji: "👄", cat: "body" },
  { en: "hand", id: "tangan", emoji: "✋", cat: "body" },
  { en: "foot", id: "kaki", emoji: "🦶", cat: "body" },
  { en: "tooth", id: "gigi", emoji: "🦷", cat: "body" },
  { en: "tongue", id: "lidah", emoji: "👅", cat: "body" },
  { en: "brain", id: "otak", emoji: "🧠", cat: "body" },
  { en: "arm", id: "lengan", emoji: "💪", cat: "body" },
  { en: "bone", id: "tulang", emoji: "🦴", cat: "body" },

  // Keluarga & orang
  { en: "mother", id: "ibu", emoji: "👩", cat: "people" },
  { en: "father", id: "ayah", emoji: "👨", cat: "people" },
  { en: "baby", id: "bayi", emoji: "👶", cat: "people" },
  { en: "grandmother", id: "nenek", emoji: "👵", cat: "people" },
  { en: "grandfather", id: "kakek", emoji: "👴", cat: "people" },
  { en: "boy", id: "anak laki-laki", emoji: "👦", cat: "people" },
  { en: "girl", id: "anak perempuan", emoji: "👧", cat: "people" },
  { en: "family", id: "keluarga", emoji: "👨‍👩‍👧", cat: "people" },
  { en: "teacher", id: "guru", emoji: "🧑‍🏫", cat: "people" },
  { en: "doctor", id: "dokter", emoji: "🧑‍⚕️", cat: "people" },
];

export type SentenceItem = {
  text: string; // pakai "___" untuk bagian yang kosong
  answer: string;
  options: string[]; // sudah termasuk jawaban
  id: string; // terjemahan Indonesia
};

export const SENTENCES: SentenceItem[] = [
  { text: "I see with my ___.", answer: "eyes", options: ["eyes", "ears", "nose", "hands"], id: "Aku melihat dengan mataku." },
  { text: "I hear with my ___.", answer: "ears", options: ["ears", "eyes", "feet", "teeth"], id: "Aku mendengar dengan telingaku." },
  { text: "I smell with my ___.", answer: "nose", options: ["nose", "mouth", "hand", "foot"], id: "Aku mencium dengan hidungku." },
  { text: "I brush my ___ every morning.", answer: "teeth", options: ["teeth", "eyes", "ears", "feet"], id: "Aku menyikat gigiku setiap pagi." },
  { text: "A ___ says meow.", answer: "cat", options: ["cat", "dog", "duck", "cow"], id: "Seekor kucing berbunyi meong." },
  { text: "A ___ says quack.", answer: "duck", options: ["duck", "cat", "lion", "horse"], id: "Seekor bebek berbunyi kwek." },
  { text: "A ___ lives in the water.", answer: "fish", options: ["fish", "bird", "monkey", "rabbit"], id: "Seekor ikan hidup di dalam air." },
  { text: "A fish can ___.", answer: "swim", options: ["swim", "fly", "write", "read"], id: "Ikan bisa berenang." },
  { text: "My father is a man. My ___ is a woman.", answer: "mother", options: ["mother", "father", "boy", "grandfather"], id: "Ayahku seorang laki-laki. Ibuku seorang perempuan." },
  { text: "The sun is very ___.", answer: "hot", options: ["hot", "cold", "wet", "sad"], id: "Matahari sangat panas." },
  { text: "I read a ___.", answer: "book", options: ["book", "chair", "door", "ball"], id: "Aku membaca sebuah buku." },
  { text: "I write with a ___.", answer: "pencil", options: ["pencil", "banana", "bed", "umbrella"], id: "Aku menulis dengan pensil." },
  { text: "I ride a ___ to school.", answer: "bicycle", options: ["bicycle", "house", "apple", "tree"], id: "Aku naik sepeda ke sekolah." },
  { text: "How ___ you? I am fine.", answer: "are", options: ["are", "is", "am", "do"], id: "Apa kabar? Aku baik." },
  { text: "She ___ a student.", answer: "is", options: ["is", "am", "are", "be"], id: "Dia seorang pelajar." },
  { text: "I ___ happy today.", answer: "am", options: ["am", "is", "are", "were"], id: "Aku senang hari ini." },
  { text: "They ___ playing football.", answer: "are", options: ["are", "is", "am", "be"], id: "Mereka sedang bermain sepak bola." },
  { text: "He ___ a book every day.", answer: "reads", options: ["reads", "read", "reading", "readed"], id: "Dia membaca buku setiap hari." },
  { text: "We ___ to school by bus.", answer: "go", options: ["go", "goes", "going", "gone"], id: "Kami pergi ke sekolah naik bus." },
  { text: "There are three ___ on the table.", answer: "apples", options: ["apples", "apple", "appling", "an apple"], id: "Ada tiga apel di atas meja." },
];

export type BuildItem = { en: string; id: string };

// Kalimat untuk quest "susun kata jadi kalimat"
export const BUILD_SENTENCES: BuildItem[] = [
  { en: "I like apples", id: "Aku suka apel" },
  { en: "She has a cat", id: "Dia punya seekor kucing" },
  { en: "The dog is big", id: "Anjing itu besar" },
  { en: "I see a bird", id: "Aku melihat seekor burung" },
  { en: "He is my father", id: "Dia ayahku" },
  { en: "We love our mother", id: "Kami sayang ibu kami" },
  { en: "The sun is hot", id: "Matahari itu panas" },
  { en: "I read a book", id: "Aku membaca sebuah buku" },
  { en: "My bag is red", id: "Tasku berwarna merah" },
  { en: "The fish can swim", id: "Ikan itu bisa berenang" },
  { en: "I have two eyes", id: "Aku punya dua mata" },
  { en: "She is a good teacher", id: "Dia guru yang baik" },
  { en: "They are playing football", id: "Mereka sedang bermain sepak bola" },
  { en: "I brush my teeth every morning", id: "Aku menyikat gigi setiap pagi" },
  { en: "The baby is sleeping on the bed", id: "Bayi itu tidur di tempat tidur" },
  { en: "My brother likes to eat bananas", id: "Kakakku suka makan pisang" },
  { en: "We go to school by bicycle", id: "Kami pergi ke sekolah naik sepeda" },
  { en: "The bird sings in the tree", id: "Burung itu bernyanyi di pohon" },
  { en: "My grandmother makes delicious bread", id: "Nenekku membuat roti yang enak" },
  { en: "The teacher writes a word on the board", id: "Guru menulis sebuah kata di papan" },
  { en: "A rabbit eats a carrot", id: "Seekor kelinci makan wortel" },
  { en: "Please open the door", id: "Tolong buka pintunya" },
];
