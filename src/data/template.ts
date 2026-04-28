import type { Section } from '../types';

export interface Template {
  id: string;
  title: string;
  sections: Section[];
}

export const MASTER_TEMPLATE: Template = {
  id: 'mr_kolano_prawe',
  title: 'REZONANS MAGNETYCZNY KOLANA PRAWEGO',
  sections: [
    { id: 'wskazanie',  label: 'Wskazanie',
      text: 'Wskazanie: ból kolana, podejrzenie uszkodzenia łąkotki przyśrodkowej. Uraz skrętny 3 tygodnie temu.',
      pending: false },
    { id: 'technika', label: 'Technika',
      text: 'Badanie wykonano w sekwencjach PD, T1, T2 z saturacją tłuszczu w płaszczyznach strzałkowej, czołowej i poprzecznej.',
      pending: false },
    { id: 'lakotka_p', label: 'Łąkotka przyśrodkowa',
      text: 'Łąkotka przyśrodkowa: prawidłowa, bez cech uszkodzenia.',
      pending: true },
    { id: 'lakotka_b', label: 'Łąkotka boczna',
      text: 'Łąkotka boczna: prawidłowa, bez cech uszkodzenia.',
      pending: true },
    { id: 'acl', label: 'Więzadło krzyżowe przednie',
      text: 'Więzadło krzyżowe przednie (ACL): prawidłowe, ciągłe na całym przebiegu.',
      pending: true },
    { id: 'pcl', label: 'Więzadło krzyżowe tylne',
      text: 'Więzadło krzyżowe tylne (PCL): prawidłowe, ciągłe.',
      pending: true },
    { id: 'mcl', label: 'Więzadła poboczne',
      text: 'Więzadła poboczne (MCL, LCL): prawidłowe, bez cech uszkodzenia.',
      pending: true },
    { id: 'chrzastka', label: 'Chrząstka stawowa',
      text: 'Chrząstka stawowa: bez cech istotnego uszkodzenia.',
      pending: true },
    { id: 'kosci', label: 'Kości',
      text: 'Kości tworzące staw: bez zmian patologicznych, bez obrzęku szpiku.',
      pending: true },
    { id: 'wysiek', label: 'Jama stawu',
      text: 'Jama stawu: bez wysięku.',
      pending: true },
    { id: 'tkanki', label: 'Tkanki miękkie',
      text: 'Tkanki miękkie okołostawowe: bez zmian.',
      pending: true },
    { id: 'wnioski', label: 'Wnioski',
      text: '1. Badanie bez istotnych odchyleń od normy.',
      pending: true },
  ],
};
