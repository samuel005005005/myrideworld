import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/auth_controller.dart';

class WelcomePage extends ConsumerStatefulWidget {
  const WelcomePage({super.key});

  @override
  ConsumerState<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends ConsumerState<WelcomePage> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _obscureText = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final name = _nameController.text.trim();

    if (email.isEmpty || password.isEmpty || name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.loginEmptyFields)),
      );
      return;
    }

    // Usamos el login dummy del controlador actual por el momento (MVP)
    final exito = await ref
        .read(authControllerProvider.notifier)
        .login(email: email, password: password, rol: 'pasajero');

    if (exito && mounted) {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final theme = Theme.of(context);

    // Minimalist colors matching login_page
    const brandPrimary = Color(0xFFF59E0B);
    const orangeLight = Color(0xFFFEF3C7);
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const borderGrey = Color(0xFFE2E8F0);

    ref.listen<AsyncValue>(authControllerProvider, (_, state) {
      if (!state.isLoading && state.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(state.error.toString()),
            backgroundColor: Colors.red,
          ),
        );
      }
    });

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textDark),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Icon
                Center(
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: orangeLight,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(
                      Icons.person_add_outlined,
                      size: 32,
                      color: brandPrimary,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Title
                Text(
                  'Crear Cuenta',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: textDark,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  AppStrings.loginTurismoSeguro,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: textGrey,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.5,
                  ),
                ),

                const SizedBox(height: 32),

                // Full Name
                _buildLabel(AppStrings.welcomeFullNameLabel, textGrey),
                const SizedBox(height: 8),
                _buildTextField(
                  controller: _nameController,
                  hint: AppStrings.welcomeFullNamePlaceholder,
                  keyboardType: TextInputType.name,
                  textDark: textDark,
                  textGrey: textGrey,
                  borderGrey: borderGrey,
                  brandPrimary: brandPrimary,
                ),
                const SizedBox(height: 16),

                // Email Field
                _buildLabel(AppStrings.welcomeEmailLabel, textGrey),
                const SizedBox(height: 8),
                _buildTextField(
                  controller: _emailController,
                  hint: AppStrings.welcomeEmailPlaceholder,
                  keyboardType: TextInputType.emailAddress,
                  textDark: textDark,
                  textGrey: textGrey,
                  borderGrey: borderGrey,
                  brandPrimary: brandPrimary,
                ),
                const SizedBox(height: 16),

                // Phone
                _buildLabel(AppStrings.welcomePhoneLabel, textGrey),
                const SizedBox(height: 8),
                _buildTextField(
                  controller: _phoneController,
                  hint: AppStrings.welcomePhonePlaceholder,
                  keyboardType: TextInputType.phone,
                  textDark: textDark,
                  textGrey: textGrey,
                  borderGrey: borderGrey,
                  brandPrimary: brandPrimary,
                ),
                const SizedBox(height: 16),

                // Password Field
                _buildLabel(AppStrings.loginPasswordLabel, textGrey),
                const SizedBox(height: 8),
                TextField(
                  controller: _passwordController,
                  obscureText: _obscureText,
                  style: const TextStyle(color: textDark),
                  decoration: InputDecoration(
                    hintText: AppStrings.loginPasswordPlaceholder,
                    hintStyle: TextStyle(color: textGrey.withOpacity(0.5)),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 16,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: borderGrey),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: brandPrimary),
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureText
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: textGrey.withOpacity(0.7),
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscureText = !_obscureText;
                        });
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                // Terms
                Text(
                  AppStrings.welcomeTermsAgree,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: textGrey.withOpacity(0.8),
                    height: 1.4,
                  ),
                ),

                const SizedBox(height: 16),

                // Register Button
                ElevatedButton(
                  onPressed: authState.isLoading ? null : _register,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: brandPrimary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: authState.isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Text(
                          AppStrings.welcomeStartTraveling,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text, Color textGrey) {
    return Text(
      text,
      style: TextStyle(
        color: textGrey,
        fontWeight: FontWeight.w600,
        fontSize: 12,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required TextInputType keyboardType,
    required Color textDark,
    required Color textGrey,
    required Color borderGrey,
    required Color brandPrimary,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: TextStyle(color: textDark),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: textGrey.withOpacity(0.5)),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: borderGrey),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: brandPrimary),
        ),
        filled: true,
        fillColor: Colors.white,
      ),
    );
  }
}
