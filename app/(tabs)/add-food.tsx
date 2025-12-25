import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useNutrition } from '@/contexts/nutrition-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FoodProduct } from '@/types/nutrition';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const mealTypes: { type: MealType; label: string; icon: string }[] = [
  { type: 'breakfast', label: 'Сніданок', icon: 'sunrise.fill' },
  { type: 'lunch', label: 'Обід', icon: 'sun.max.fill' },
  { type: 'dinner', label: 'Вечеря', icon: 'moon.fill' },
  { type: 'snack', label: 'Перекус', icon: 'cup.and.saucer.fill' },
];

export default function AddFoodScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const { products, searchProducts, addFoodEntry } = useNutrition();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);
  const [amount, setAmount] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [showProductModal, setShowProductModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const filteredProducts = searchProducts(searchQuery);

  const handleSelectProduct = (product: FoodProduct) => {
    setSelectedProduct(product);
    setAmount(String(product.defaultAmount));
    setShowProductModal(true);
  };

  const handleAddFood = async () => {
    if (!selectedProduct || !amount) {
      Alert.alert('Помилка', 'Виберіть продукт та вкажіть кількість');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Помилка', 'Введіть коректну кількість');
      return;
    }

    setIsAdding(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      await addFoodEntry({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        amount: amountNum,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        mealType: selectedMeal,
        date: today,
      });

      Alert.alert('Успіх', 'Продукт додано!');
      setSelectedProduct(null);
      setAmount('');
      setSearchQuery('');
      setShowProductModal(false);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося додати продукт');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Додати їжу
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <IconSymbol size={20} name="magnifyingglass" color={iconColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: iconColor, borderColor }]}
          placeholder="Пошук продуктів..."
          placeholderTextColor={iconColor + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      <ScrollView style={styles.productsList}>
        {filteredProducts.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>Продуктів не знайдено</ThemedText>
          </ThemedView>
        ) : (
          filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { borderColor }]}
              onPress={() => handleSelectProduct(product)}
              activeOpacity={0.7}>
              <ThemedView style={styles.productInfo}>
                <ThemedText type="defaultSemiBold" style={styles.productName}>
                  {product.name}
                </ThemedText>
                <ThemedText style={styles.productDetails}>
                  {product.calories} ккал / {product.defaultAmount}
                  {product.unit === 'g' ? 'г' : product.unit === 'ml' ? 'мл' : 'шт'}
                </ThemedText>
                <ThemedView style={styles.macrosRow}>
                  <ThemedText style={styles.macroText}>Б: {product.protein}г</ThemedText>
                  <ThemedText style={styles.macroText}>В: {product.carbs}г</ThemedText>
                  <ThemedText style={styles.macroText}>Ж: {product.fat}г</ThemedText>
                </ThemedView>
              </ThemedView>
              <IconSymbol size={24} name="plus.circle.fill" color={tintColor} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showProductModal && selectedProduct !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderColor, backgroundColor }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                {selectedProduct?.name}
              </ThemedText>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.mealTypeContainer}>
              <ThemedText style={styles.label}>Прийом їжі:</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <ThemedView style={styles.mealTypesRow}>
                  {mealTypes.map((meal) => (
                    <TouchableOpacity
                      key={meal.type}
                      style={[
                        styles.mealTypeButton,
                        {
                          backgroundColor: selectedMeal === meal.type ? tintColor : backgroundColor,
                          borderColor: tintColor,
                        },
                      ]}
                      onPress={() => setSelectedMeal(meal.type)}
                      activeOpacity={0.7}>
                      <IconSymbol
                        size={20}
                        name={meal.icon as any}
                        color={selectedMeal === meal.type ? '#fff' : tintColor}
                      />
                      <ThemedText
                        style={[
                          styles.mealTypeText,
                          { color: selectedMeal === meal.type ? '#fff' : tintColor },
                        ]}>
                        {meal.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ScrollView>
            </ThemedView>

            <ThemedView style={styles.amountContainer}>
              <ThemedText style={styles.label}>Кількість:</ThemedText>
              <TextInput
                style={[styles.amountInput, { color: iconColor, borderColor }]}
                placeholder="Введіть кількість"
                placeholderTextColor={iconColor + '80'}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <ThemedText style={styles.unitText}>
                {selectedProduct?.unit === 'g'
                  ? 'грам'
                  : selectedProduct?.unit === 'ml'
                  ? 'мілілітрів'
                  : 'штук'}
              </ThemedText>
            </ThemedView>

            {selectedProduct && amount && !isNaN(parseFloat(amount)) && (
              <ThemedView style={styles.previewCard}>
                <ThemedText style={styles.previewTitle}>Попередній перегляд:</ThemedText>
                <ThemedView style={styles.previewRow}>
                  <ThemedText style={styles.previewLabel}>Калорії:</ThemedText>
                  <ThemedText style={styles.previewValue}>
                    {Math.round(
                      (selectedProduct.calories * parseFloat(amount)) /
                        selectedProduct.defaultAmount,
                    )}{' '}
                    ккал
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.previewRow}>
                  <ThemedText style={styles.previewLabel}>Білки:</ThemedText>
                  <ThemedText style={styles.previewValue}>
                    {(
                      (selectedProduct.protein * parseFloat(amount)) /
                      selectedProduct.defaultAmount
                    ).toFixed(1)}{' '}
                    г
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.previewRow}>
                  <ThemedText style={styles.previewLabel}>Вуглеводи:</ThemedText>
                  <ThemedText style={styles.previewValue}>
                    {(
                      (selectedProduct.carbs * parseFloat(amount)) /
                      selectedProduct.defaultAmount
                    ).toFixed(1)}{' '}
                    г
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.previewRow}>
                  <ThemedText style={styles.previewLabel}>Жири:</ThemedText>
                  <ThemedText style={styles.previewValue}>
                    {(
                      (selectedProduct.fat * parseFloat(amount)) /
                      selectedProduct.defaultAmount
                    ).toFixed(1)}{' '}
                    г
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}

            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: tintColor },
                isAdding && { opacity: 0.7 },
              ]}
              onPress={handleAddFood}
              activeOpacity={0.8}
              disabled={isAdding}>
              {isAdding ? (
                <ThemedText style={styles.addButtonText}>Додавання...</ThemedText>
              ) : (
                <ThemedText style={styles.addButtonText}>Додати</ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>

      <LoadingOverlay visible={isAdding} message="Додавання продукту..." />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  productsList: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
  },
  mealTypeContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  mealTypesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
  },
  unitText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
