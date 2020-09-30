export default function formataData(data: string): string {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const date = new Date(data);

  const dataFormatada = date.toLocaleDateString('pt-br', options);

  return dataFormatada;
}
