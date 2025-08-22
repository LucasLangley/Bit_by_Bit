# Conversor de Imagens Retro 8-bit

Um conversor moderno e interativo que transforma suas imagens em arte pixel autêntica no estilo dos videogames clássicos dos anos 80 e 90.

## 🎮 Características

### Estilos Prontos
- **Game Boy**: Paleta monocromática verde clássica
- **NES**: Cores vibrantes do Nintendo Entertainment System
- **Commodore 64**: Paleta icônica de 16 cores
- **Pixel Limpo**: Estilo moderno de pixel art

### Controles Avançados
- **Resolução Pixel**: Ajuste de 32px a 256px de largura
- **Contraste e Saturação**: Controle fino da aparência
- **Algoritmos de Dithering**: Floyd-Steinberg ou Bayer
- **Métricas de Cor**: RGB ou CIELAB para precisão perceptual
- **Efeito Scanlines**: Simula monitores CRT retrô
- **Paleta Customizada**: Crie suas próprias combinações de cores

## 🚀 Como Usar

### Carregamento de Imagem
1. **Arrastar e Soltar**: Simplesmente arraste uma imagem para a área indicada
2. **Seleção Manual**: Clique em "Escolher Arquivo" para navegar pelos seus arquivos
3. **Formatos Suportados**: JPG, JPEG, PNG, WebP e outros formatos de imagem

### Conversão
1. Selecione um dos **estilos prontos** ou ajuste manualmente
2. A conversão acontece em **tempo real** conforme você altera os parâmetros
3. **Visualização lado a lado** da imagem original e convertida

### Exportação
- **Download**: Salve o resultado como PNG
- **Copiar**: Copie diretamente para a área de transferência
- **Qualidade**: Imagem final mantém resolução original com efeito pixel aplicado

## ⚙️ Tecnologias

### Frontend
- **React 18**: Interface moderna e responsiva
- **Hooks Personalizados**: useDebounce para otimização de performance
- **CSS Modules**: Estilos isolados e modulares
- **Canvas API**: Processamento de imagem em tempo real

### Processamento
- **Web Workers**: Conversão assíncrona sem travar a interface
- **Algoritmos de Dithering**: 
  - Floyd-Steinberg para gradientes suaves
  - Bayer (Ordered) para padrões estruturados
- **Espaços de Cor**: Suporte a RGB e CIELAB
- **Otimização de Performance**: Debouncing e processamento otimizado

## 📐 Algoritmos Implementados

### Dithering Floyd-Steinberg
Distribui o erro de quantização para pixels vizinhos, criando gradientes suaves mesmo com paletas limitadas.

### Dithering Bayer (Ordered)
Usa uma matriz 4x4 para criar padrões estruturados e consistentes, ideal para texturas uniformes.

### Métrica CIELAB
Calcula distâncias de cor baseadas na percepção humana, resultando em conversões mais naturais.

### Paletas Históricas Autênticas
Todas as paletas são baseadas nas especificações técnicas reais dos sistemas originais.

## 🎨 Paletas Disponíveis

| Sistema | Cores | Características |
|---------|-------|----------------|
| Game Boy | 4 tons | Verde monocromático clássico |
| NES | 54 cores | Paleta completa do sistema |
| Commodore 64 | 16 cores | Cores vibrantes e contrastantes |
| Master System | 16 cores | Paleta equilibrada da Sega |
| PICO-8 | 16 cores | Paleta moderna de fantasy console |
| Customizada | Até 16 cores | Crie sua própria paleta |

## 🔧 Recursos Técnicos

### Otimizações de Performance
- **Debouncing**: Evita processamento excessivo durante ajustes
- **Web Workers**: Processamento paralelo sem bloquear a UI
- **Canvas Otimizado**: Rendering eficiente para grandes imagens
- **Redimensionamento Inteligente**: Sugere otimização para imagens muito grandes

### Compatibilidade
- **Navegadores Modernos**: Chrome, Firefox, Safari, Edge
- **Clipboard API**: Cópia direta de imagens
- **File API**: Suporte completo a drag & drop
- **LocalStorage**: Salva preferências automaticamente

## 📱 Interface

### Design Responsivo
- **Layout Adaptivo**: Funciona em desktop, tablet e mobile
- **Controles Intuitivos**: Sliders, dropdowns e botões organizados
- **Visualização Clara**: Comparação lado a lado das imagens
- **Feedback Visual**: Indicadores de carregamento e status

### Experiência do Usuário
- **Tempo Real**: Visualização instantânea das alterações
- **Presets Rápidos**: Um clique para estilos populares
- **Histórico de Configurações**: Salva automaticamente suas preferências
- **Tooltips Informativos**: Explicações sobre cada recurso

## 🎯 Casos de Uso

- **Game Development**: Criação de sprites e texturas pixel art
- **Arte Digital**: Estilização de fotografias e ilustrações
- **Nostalgia**: Recriação da estética dos videogames clássicos
- **Design Gráfico**: Elementos visuais com tema retrô
- **Educação**: Demonstração de técnicas de processamento de imagem

---

**Desenvolvido com ❤️ para os amantes do estilo 8 bits**
