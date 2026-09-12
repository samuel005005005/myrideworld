import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/app_strings.dart';

class LoginPage extends ConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.loginTitle)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(AppStrings.loginSubtitle),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {},
              child: const Text(AppStrings.loginButton),
            ),
          ],
        ),
      ),
    );
  }
}
