# Method 1: Using Slicing
def reverse_slice(s):
    return s[::-1]

# Method 2: Using reversed() and join
def reverse_builtin(s):
    return ''.join(reversed(s))

# Method 3: Manual using loop
def reverse_manual(s):
    rev = ''
    for ch in s:
        rev = ch + rev
    return rev

string = "OpenAI"
print(reverse_slice(string))
print(reverse_builtin(string))
print(reverse_manual(string))
