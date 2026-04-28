import type { DictationStep } from '../types';

export const DICTATION_SCRIPT: DictationStep[] = [
  {
    target: 'lakotka_b',
    transcript: 'łąkotka boczna prawidłowa bez cech uszkodzenia w obu rogach',
    newText: 'Łąkotka boczna: prawidłowa, bez cech uszkodzenia w rogu przednim ani tylnym.',
    showLockToast: true,
  },
  {
    target: 'lakotka_p',
    transcript: 'róg tylny łąkotki przyśrodkowej skośne przytorebkowe pęknięcie',
    newText: 'Łąkotka przyśrodkowa: w rogu tylnym widoczne skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe sięgające górnej powierzchni stawowej. Wysokość rogu tylnego zachowana.',
  },
  {
    target: 'acl',
    transcript: 'ACL trzeciego stopnia w przyczepie udowym',
    newText: 'Więzadło krzyżowe przednie (ACL): zerwanie III stopnia w przyczepie udowym, z brakiem ciągłości włókien. Włókna pofałdowane, leżą poziomo na płaskowyżu kości piszczelowej. Towarzyszy bone bruise w okolicy przyczepu.',
    removeTargets: ['mcl'],
  },
  {
    target: 'kosci',
    transcript: 'obrzęk szpiku kłykieć boczny dwanaście na osiem milimetrów',
    newText: 'Kości tworzące staw: w kłykciu bocznym kości udowej widoczny obszar obrzęku szpiku kostnego (bone bruise) o wymiarach około 12 × 8 mm. Pozostałe kości bez zmian patologicznych.',
    removeTargets: ['chrzastka'],
  },
  {
    target: 'wysiek',
    transcript: 'niewielki wysięk w zachyłku nadrzepkowym',
    newText: 'Jama stawu: obecny niewielki wysięk w zachyłku nadrzepkowym. Bez cech krwiaka.',
  },
  {
    target: 'wnioski',
    transcript: 'wygeneruj wnioski',
    newText:
      '1. Skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe rogu tylnego łąkotki przyśrodkowej.\n' +
      '2. Zerwanie więzadła krzyżowego przedniego (ACL) III stopnia w przyczepie udowym.\n' +
      '3. Obszar obrzęku szpiku kostnego (bone bruise) w kłykciu bocznym kości udowej (12 × 8 mm).\n' +
      '4. Niewielki wysięk w jamie stawu.\n' +
      '5. Pozostałe struktury bez istotnych odchyleń od normy.',
    removeTargets: ['pcl', 'tkanki'],
  },
];
