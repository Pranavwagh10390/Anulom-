arr = [1, 5, 8, 10, 20]
key = 10

# 1. Linear Search
def linear_search(arr, key):
    for i in arr:
        if i == key:
            return True
    return False

# 2. in keyword
def in_search(arr, key):
    return key in arr

# 3. Binary Search (sorted list)
def binary_search(arr, key):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == key:
            return True
        elif arr[mid] < key:
            low = mid + 1
        else:
            high = mid - 1
    return False

print(linear_search(arr, key))
print(in_search(arr, key))
print(binary_search(sorted(arr), key))
